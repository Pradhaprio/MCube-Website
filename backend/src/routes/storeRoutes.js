import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/storeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile', getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
