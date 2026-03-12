import crypto from 'crypto';

export function createId(prefix = 'id') {
  return crypto.randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeText(value = '') {
  return String(value).replace(/[<>]/g, '').trim();
}

export function parseNumber(value, fallback = null) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function getDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) {
    return 'tablet';
  }
  if (/mobi|android|iphone/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
