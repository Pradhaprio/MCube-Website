import { Router } from 'express';
import { listNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listNotifications);
router.patch('/:id/read', requireAuth, markNotificationRead);

export default router;
