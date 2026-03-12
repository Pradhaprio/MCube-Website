import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { seedData } from '../data/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '..', '..', '..', 'database', 'schema.sql');

let pool;
let postgresReady = false;

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function normalizeOwners(data) {
  const owners = await Promise.all(
    data.owners.map(async (owner) => {
      if (!owner.passwordHash.startsWith('$2')) {
        const hashed = await bcrypt.hash(owner.passwordHash, 10);
        return { ...owner, passwordHash: hashed };
      }
      return owner;
    })
  );
  return { ...data, owners };
}

function shouldUsePostgres() {
  return env.storageDriver === 'postgres' && Boolean(env.databaseUrl);
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

async function ensureFileStore() {
  try {
    await fs.access(env.dataFile);
  } catch {
    await ensureDir(env.dataFile);
    const data = await normalizeOwners(seedData);
    await fs.writeFile(env.dataFile, JSON.stringify(data, null, 2));
  }
}

async function readFileStore() {
  await ensureFileStore();
  const raw = await fs.readFile(env.dataFile, 'utf8');
  const data = JSON.parse(raw);
  return normalizeOwners(data);
}

async function writeFileStore(data) {
  await ensureDir(env.dataFile);
  await fs.writeFile(env.dataFile, JSON.stringify(data, null, 2));
  return data;
}

async function queryAll(client, sql) {
  const result = await client.query(sql);
  return result.rows;
}

async function ensurePostgres() {
  if (!shouldUsePostgres() || postgresReady) {
    return;
  }

  const client = await getPool().connect();
  try {
    if (env.autoInitDb) {
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      await client.query(schemaSql);
    }

    const existing = await client.query('SELECT COUNT(*)::int AS count FROM owners');
    if (existing.rows[0].count === 0) {
      const normalized = await normalizeOwners(seedData);
      await writePostgresStore(normalized, client);
    }
    postgresReady = true;
  } finally {
    client.release();
  }
}

async function readPostgresStore() {
  await ensurePostgres();
  const client = await getPool().connect();
  try {
    const owners = await queryAll(client, 'SELECT * FROM owners ORDER BY created_at ASC');
    const storeProfiles = await queryAll(client, 'SELECT * FROM store_profiles ORDER BY created_at ASC');
    const categories = await queryAll(
      client,
      'SELECT * FROM categories ORDER BY CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END, sort_order ASC, created_at ASC'
    );
    const catalogItems = await queryAll(client, 'SELECT * FROM catalog_items ORDER BY created_at DESC');
    const catalogImages = await queryAll(client, 'SELECT * FROM catalog_images ORDER BY catalog_item_id ASC, sort_order ASC');
    const catalogTags = await queryAll(client, 'SELECT * FROM catalog_tags ORDER BY catalog_item_id ASC');
    const reviews = await queryAll(client, 'SELECT * FROM reviews ORDER BY created_at DESC');
    const leads = await queryAll(client, 'SELECT * FROM leads ORDER BY created_at DESC');
    const analyticsEvents = await queryAll(client, 'SELECT * FROM analytics_events ORDER BY created_at DESC');
    const notifications = await queryAll(client, 'SELECT * FROM notifications ORDER BY created_at DESC');

    const imagesByItem = new Map();
    catalogImages.forEach((row) => {
      const current = imagesByItem.get(row.catalog_item_id) || [];
      current.push(row.image_url);
      imagesByItem.set(row.catalog_item_id, current);
    });

    const tagsByItem = new Map();
    catalogTags.forEach((row) => {
      const current = tagsByItem.get(row.catalog_item_id) || [];
      current.push(row.tag);
      tagsByItem.set(row.catalog_item_id, current);
    });

    return {
      owners: owners.map((row) => ({
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        passwordHash: row.password_hash,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      storeProfile: storeProfiles[0]
        ? {
            id: storeProfiles[0].id,
            ownerId: storeProfiles[0].owner_id,
            shopName: storeProfiles[0].shop_name,
            logoUrl: storeProfiles[0].logo_url,
            bannerUrl: storeProfiles[0].banner_url,
            phone: storeProfiles[0].phone,
            whatsappNumber: storeProfiles[0].whatsapp_number,
            email: storeProfiles[0].email,
            addressLine1: storeProfiles[0].address_line_1,
            addressLine2: storeProfiles[0].address_line_2,
            city: storeProfiles[0].city,
            state: storeProfiles[0].state,
            postalCode: storeProfiles[0].postal_code,
            latitude: toNumber(storeProfiles[0].latitude),
            longitude: toNumber(storeProfiles[0].longitude),
            openingHours: storeProfiles[0].opening_hours_json,
            announcementText: storeProfiles[0].announcement_text,
            isShopOpenOverride: storeProfiles[0].is_shop_open_override,
            createdAt: storeProfiles[0].created_at,
            updatedAt: storeProfiles[0].updated_at
          }
        : null,
      categories: categories.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        parentId: row.parent_id,
        sortOrder: row.sort_order,
        createdAt: row.created_at
      })),
      catalogItems: catalogItems.map((row) => ({
        id: row.id,
        itemType: row.item_type,
        title: row.title,
        slug: row.slug,
        shortDescription: row.short_description,
        fullDescription: row.full_description,
        price: toNumber(row.price),
        discountPrice: toNumber(row.discount_price),
        currency: row.currency,
        categoryId: row.category_id,
        subcategoryId: row.subcategory_id,
        tags: tagsByItem.get(row.id) || [],
        stockQuantity: row.stock_quantity,
        stockStatus: row.stock_status,
        featured: row.featured,
        pinned: row.pinned,
        images: imagesByItem.get(row.id) || [],
        thumbnailUrl: row.thumbnail_url,
        averageRating: toNumber(row.average_rating) || 0,
        totalReviews: row.total_reviews,
        specs: row.specs_json || [],
        serviceDetails: row.service_details_json || undefined,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      reviews: reviews.map((row) => ({
        id: row.id,
        catalogItemId: row.catalog_item_id,
        reviewerName: row.reviewer_name,
        rating: row.rating,
        title: row.title,
        comment: row.comment,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      leads: leads.map((row) => ({
        id: row.id,
        visitorName: row.visitor_name,
        phoneNumber: row.phone_number,
        selectedCatalogItemId: row.selected_catalog_item_id,
        selectedItemTitleSnapshot: row.selected_item_title_snapshot,
        selectedItemTypeSnapshot: row.selected_item_type_snapshot,
        message: row.message,
        preferredCallbackTime: row.preferred_callback_time,
        contactMethodPreference: row.contact_method_preference,
        consentAccepted: row.consent_accepted,
        consentTimestamp: row.consent_timestamp,
        sourcePage: row.source_page,
        deviceType: row.device_type,
        referralSource: row.referral_source,
        status: row.status,
        ownerNotes: row.owner_notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      analyticsEvents: analyticsEvents.map((row) => ({
        id: row.id,
        sessionId: row.session_id,
        eventType: row.event_type,
        viewedCatalogItemId: row.viewed_catalog_item_id,
        pagePath: row.page_path,
        referrer: row.referrer,
        deviceType: row.device_type,
        ctaClicked: row.cta_clicked,
        sourcePage: row.source_page,
        createdAt: row.created_at
      })),
      notifications: notifications.map((row) => ({
        id: row.id,
        ownerId: row.owner_id,
        type: row.type,
        productId: row.product_id,
        leadId: row.lead_id,
        title: row.title,
        message: row.message,
        isRead: row.is_read,
        createdAt: row.created_at
      }))
    };
  } finally {
    client.release();
  }
}

async function writePostgresStore(data, existingClient = null) {
  if (!existingClient) {
    await ensurePostgres();
  }
  const client = existingClient || (await getPool().connect());
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM analytics_events');
    await client.query('DELETE FROM leads');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM catalog_tags');
    await client.query('DELETE FROM catalog_images');
    await client.query('DELETE FROM catalog_items');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM store_profiles');
    await client.query('DELETE FROM owners');

    for (const owner of data.owners) {
      await client.query(
        `INSERT INTO owners (id, email, password_hash, full_name, role, is_active, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          owner.id,
          owner.email,
          owner.passwordHash,
          owner.fullName,
          owner.role,
          owner.isActive,
          owner.createdAt,
          owner.updatedAt
        ]
      );
    }

    if (data.storeProfile) {
      const profile = data.storeProfile;
      await client.query(
        `INSERT INTO store_profiles (
          id, owner_id, shop_name, logo_url, banner_url, phone, whatsapp_number, email,
          address_line_1, address_line_2, city, state, postal_code, latitude, longitude,
          opening_hours_json, announcement_text, is_shop_open_override, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [
          profile.id,
          profile.ownerId,
          profile.shopName,
          profile.logoUrl,
          profile.bannerUrl,
          profile.phone,
          profile.whatsappNumber,
          profile.email,
          profile.addressLine1,
          profile.addressLine2,
          profile.city,
          profile.state,
          profile.postalCode,
          profile.latitude,
          profile.longitude,
          JSON.stringify(profile.openingHours || {}),
          profile.announcementText,
          profile.isShopOpenOverride,
          profile.createdAt,
          profile.updatedAt
        ]
      );
    }

    const orderedCategories = [...data.categories].sort((a, b) => {
      const parentWeightA = a.parentId ? 1 : 0;
      const parentWeightB = b.parentId ? 1 : 0;
      if (parentWeightA !== parentWeightB) {
        return parentWeightA - parentWeightB;
      }
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    for (const category of orderedCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, parent_id, sort_order, created_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [category.id, category.name, category.slug, category.parentId, category.sortOrder, category.createdAt]
      );
    }

    for (const item of data.catalogItems) {
      await client.query(
        `INSERT INTO catalog_items (
          id, item_type, title, slug, short_description, full_description, price, discount_price, currency,
          category_id, subcategory_id, stock_quantity, stock_status, featured, pinned, thumbnail_url,
          average_rating, total_reviews, specs_json, service_details_json, is_active, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          item.id,
          item.itemType,
          item.title,
          item.slug,
          item.shortDescription,
          item.fullDescription,
          item.price,
          item.discountPrice,
          item.currency,
          item.categoryId,
          item.subcategoryId,
          item.stockQuantity,
          item.stockStatus,
          item.featured,
          item.pinned,
          item.thumbnailUrl,
          item.averageRating || 0,
          item.totalReviews || 0,
          JSON.stringify(item.specs || []),
          item.serviceDetails ? JSON.stringify(item.serviceDetails) : null,
          item.isActive !== false,
          item.createdAt,
          item.updatedAt
        ]
      );

      for (const [index, image] of (item.images || []).entries()) {
        await client.query(
          `INSERT INTO catalog_images (id, catalog_item_id, image_url, alt_text, sort_order, is_thumbnail, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            crypto.randomUUID(),
            item.id,
            image,
            item.title,
            index,
            image === item.thumbnailUrl || index === 0,
            item.createdAt
          ]
        );
      }

      for (const [index, tag] of (item.tags || []).entries()) {
        await client.query(
          `INSERT INTO catalog_tags (id, catalog_item_id, tag) VALUES ($1,$2,$3)`,
          [crypto.randomUUID(), item.id, tag]
        );
      }
    }

    for (const review of data.reviews) {
      await client.query(
        `INSERT INTO reviews (id, catalog_item_id, reviewer_name, rating, title, comment, is_published, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          review.id,
          review.catalogItemId,
          review.reviewerName,
          review.rating,
          review.title,
          review.comment,
          review.isPublished,
          review.createdAt,
          review.updatedAt
        ]
      );
    }

    for (const lead of data.leads) {
      await client.query(
        `INSERT INTO leads (
          id, visitor_name, phone_number, selected_catalog_item_id, selected_item_title_snapshot,
          selected_item_type_snapshot, message, preferred_callback_time, contact_method_preference,
          consent_accepted, consent_timestamp, source_page, device_type, referral_source, status,
          owner_notes, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
        [
          lead.id,
          lead.visitorName,
          lead.phoneNumber,
          lead.selectedCatalogItemId,
          lead.selectedItemTitleSnapshot,
          lead.selectedItemTypeSnapshot,
          lead.message,
          lead.preferredCallbackTime,
          lead.contactMethodPreference,
          lead.consentAccepted,
          lead.consentTimestamp,
          lead.sourcePage,
          lead.deviceType,
          lead.referralSource,
          lead.status,
          lead.ownerNotes,
          lead.createdAt,
          lead.updatedAt
        ]
      );
    }

    for (const event of data.analyticsEvents) {
      await client.query(
        `INSERT INTO analytics_events (
          id, session_id, event_type, viewed_catalog_item_id, page_path, referrer, device_type,
          cta_clicked, source_page, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          event.id,
          event.sessionId,
          event.eventType,
          event.viewedCatalogItemId,
          event.pagePath,
          event.referrer,
          event.deviceType,
          event.ctaClicked,
          event.sourcePage,
          event.createdAt
        ]
      );
    }

    for (const notification of data.notifications) {
      await client.query(
        `INSERT INTO notifications (id, owner_id, type, product_id, lead_id, title, message, is_read, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          notification.id,
          notification.ownerId,
          notification.type,
          notification.productId,
          notification.leadId,
          notification.title,
          notification.message,
          notification.isRead,
          notification.createdAt
        ]
      );
    }

    await client.query('COMMIT');
    return data;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    if (!existingClient) {
      client.release();
    }
  }
}

export async function readStore() {
  return shouldUsePostgres() ? readPostgresStore() : readFileStore();
}

export async function writeStore(data) {
  const normalized = await normalizeOwners(data);
  return shouldUsePostgres() ? writePostgresStore(normalized) : writeFileStore(normalized);
}

export async function mutateStore(mutator) {
  const current = await readStore();
  const next = await mutator(structuredClone(current));
  await writeStore(next);
  return next;
}
