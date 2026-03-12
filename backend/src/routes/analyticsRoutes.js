import { Router } from 'express';
import { getSummary, trackEvent } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/events', trackEvent);
router.get('/summary', requireAuth, getSummary);

export default router;
