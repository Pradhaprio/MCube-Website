import { mutateStore, readStore } from '../services/dataStore.js';
import { createId, nowIso, sanitizeText } from '../utils/helpers.js';

function recalculateMetrics(data, catalogItemId) {
  const published = data.reviews.filter((review) => review.catalogItemId === catalogItemId && review.isPublished);
  const item = data.catalogItems.find((entry) => entry.id === catalogItemId);
  if (!item) return;
  const total = published.reduce((sum, review) => sum + review.rating, 0);
  item.totalReviews = published.length;
  item.averageRating = published.length ? Number((total / published.length).toFixed(1)) : 0;
}

export async function listReviews(req, res) {
  const data = await readStore();
  return res.json({ reviews: data.reviews });
}

export async function createReview(req, res) {
  const body = req.body;
  if (!body.catalogItemId || !body.reviewerName || !body.rating) {
    return res.status(400).json({ message: 'catalogItemId, reviewerName, and rating are required.' });
  }
  const timestamp = nowIso();
  const review = {
    id: createId('review'),
    catalogItemId: sanitizeText(body.catalogItemId),
    reviewerName: sanitizeText(body.reviewerName),
    rating: Number(body.rating),
    title: sanitizeText(body.title || ''),
    comment: sanitizeText(body.comment || ''),
    isPublished: body.isPublished !== false,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const next = await mutateStore((data) => {
    data.reviews.unshift(review);
    recalculateMetrics(data, review.catalogItemId);
    return data;
  });

  return res.status(201).json({ review: next.reviews[0] });
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const next = await mutateStore((data) => {
    const review = data.reviews.find((entry) => entry.id === id);
    if (!review) return data;
    review.reviewerName = sanitizeText(req.body.reviewerName || review.reviewerName);
    review.rating = Number(req.body.rating || review.rating);
    review.title = sanitizeText(req.body.title || review.title);
    review.comment = sanitizeText(req.body.comment || review.comment);
    if (typeof req.body.isPublished === 'boolean') review.isPublished = req.body.isPublished;
    review.updatedAt = nowIso();
    recalculateMetrics(data, review.catalogItemId);
    return data;
  });
  const review = next.reviews.find((entry) => entry.id === id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found.' });
  }
  return res.json({ review });
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  await mutateStore((data) => {
    const review = data.reviews.find((entry) => entry.id === id);
    data.reviews = data.reviews.filter((entry) => entry.id !== id);
    if (review) recalculateMetrics(data, review.catalogItemId);
    return data;
  });
  return res.json({ success: true });
}
