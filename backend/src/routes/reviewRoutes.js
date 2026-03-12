import { Router } from 'express';
import { createReview, deleteReview, listReviews, updateReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listReviews);
router.post('/', requireAuth, createReview);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;
