import { mutateStore, readStore } from '../services/dataStore.js';
import { createId, nowIso, parseNumber, sanitizeText, slugify } from '../utils/helpers.js';
import { validateCatalogItem } from '../utils/validators.js';

function enrichItem(item, data) {
  const category = data.categories.find((cat) => cat.id === item.categoryId) || null;
  const subcategory = data.categories.find((cat) => cat.id === item.subcategoryId) || null;
  return { ...item, category, subcategory };
}

export async function listCatalog(req, res) {
  const { q = '', category = '', itemType = '', sort = 'featured', minPrice = '', maxPrice = '' } = req.query;
  const data = await readStore();
  let items = data.catalogItems.filter((item) => item.isActive !== false);

  if (q) {
    const search = String(q).toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.shortDescription.toLowerCase().includes(search) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }
  if (category) {
    items = items.filter((item) => item.categoryId === category || item.subcategoryId === category);
  }
  if (itemType) {
    items = items.filter((item) => item.itemType === itemType);
  }
  if (minPrice) {
    items = items.filter((item) => (item.discountPrice || item.price || 0) >= Number(minPrice));
  }
  if (maxPrice) {
    items = items.filter((item) => (item.discountPrice || item.price || 0) <= Number(maxPrice));
  }

  const sorters = {
    featured: (a, b) => Number(b.pinned) - Number(a.pinned) || Number(b.featured) - Number(a.featured),
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    price_asc: (a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0),
    price_desc: (a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0),
    rating: (a, b) => b.averageRating - a.averageRating
  };

  items = items.sort(sorters[sort] || sorters.featured).map((item) => enrichItem(item, data));

  return res.json({
    items,
    categories: data.categories,
    featured: items.filter((item) => item.featured).slice(0, 6),
    trending: [...items].sort((a, b) => b.totalReviews - a.totalReviews).slice(0, 6)
  });
}

export async function getCatalogItem(req, res) {
  const { slug } = req.params;
  const data = await readStore();
  const item = data.catalogItems.find((entry) => entry.slug === slug || entry.id === slug);
  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  const related = data.catalogItems
    .filter((entry) => entry.id !== item.id && entry.categoryId === item.categoryId)
    .slice(0, 4)
    .map((entry) => enrichItem(entry, data));
  const reviews = data.reviews.filter((review) => review.catalogItemId === item.id && review.isPublished);

  return res.json({ item: enrichItem(item, data), related, reviews });
}

export async function createCatalogItem(req, res) {
  const check = validateCatalogItem(req.body);
  if (check.errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors: check.errors });
  }

  const body = req.body;
  const timestamp = nowIso();
  const item = {
    id: createId('item'),
    itemType: body.itemType,
    title: sanitizeText(body.title),
    slug: slugify(body.slug || body.title),
    shortDescription: sanitizeText(body.shortDescription),
    fullDescription: sanitizeText(body.fullDescription),
    price: parseNumber(body.price),
    discountPrice: parseNumber(body.discountPrice),
    currency: sanitizeText(body.currency || 'INR'),
    categoryId: sanitizeText(body.categoryId),
    subcategoryId: sanitizeText(body.subcategoryId || '') || null,
    tags: Array.isArray(body.tags) ? body.tags.map((tag) => sanitizeText(tag)).filter(Boolean) : [],
    stockQuantity: parseNumber(body.stockQuantity, 0),
    stockStatus: sanitizeText(body.stockStatus),
    featured: Boolean(body.featured),
    pinned: Boolean(body.pinned),
    images: Array.isArray(body.images) ? body.images.map((image) => sanitizeText(image)).filter(Boolean) : [],
    thumbnailUrl: sanitizeText(body.thumbnailUrl || body.images?.[0] || ''),
    averageRating: 0,
    totalReviews: 0,
    specs: Array.isArray(body.specs) ? body.specs.map((spec) => sanitizeText(spec)).filter(Boolean) : [],
    serviceDetails: body.itemType === 'service' ? body.serviceDetails || {} : undefined,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const next = await mutateStore((data) => {
    data.catalogItems.unshift(item);
    return data;
  });

  return res.status(201).json({ item: enrichItem(next.catalogItems.find((entry) => entry.id === item.id), next) });
}

export async function updateCatalogItem(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    const index = data.catalogItems.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return data;
    }
    const current = data.catalogItems[index];
    data.catalogItems[index] = {
      ...current,
      ...req.body,
      title: sanitizeText(req.body.title || current.title),
      slug: slugify(req.body.slug || req.body.title || current.slug),
      shortDescription: sanitizeText(req.body.shortDescription || current.shortDescription),
      fullDescription: sanitizeText(req.body.fullDescription || current.fullDescription),
      categoryId: sanitizeText(req.body.categoryId || current.categoryId),
      subcategoryId: sanitizeText(req.body.subcategoryId || current.subcategoryId || '') || null,
      price: parseNumber(req.body.price, current.price),
      discountPrice: parseNumber(req.body.discountPrice, current.discountPrice),
      stockQuantity: parseNumber(req.body.stockQuantity, current.stockQuantity),
      tags: Array.isArray(req.body.tags) ? req.body.tags.map((tag) => sanitizeText(tag)).filter(Boolean) : current.tags,
      images: Array.isArray(req.body.images) ? req.body.images.map((image) => sanitizeText(image)).filter(Boolean) : current.images,
      specs: Array.isArray(req.body.specs) ? req.body.specs.map((spec) => sanitizeText(spec)).filter(Boolean) : current.specs,
      updatedAt: nowIso()
    };
    return data;
  });
  const updated = next.catalogItems.find((entry) => entry.id === id);
  if (!updated) {
    return res.status(404).json({ message: 'Item not found.' });
  }
  return res.json({ item: enrichItem(updated, next) });
}

export async function deleteCatalogItem(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    data.catalogItems = data.catalogItems.filter((entry) => entry.id !== id);
    data.reviews = data.reviews.filter((review) => review.catalogItemId !== id);
    return data;
  });
  return res.json({ success: true, remaining: next.catalogItems.length });
}
