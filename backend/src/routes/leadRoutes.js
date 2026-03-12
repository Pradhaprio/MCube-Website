import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  listLeads,
  updateLead
} from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', createLead);
router.get('/', requireAuth, listLeads);
router.get('/export.csv', requireAuth, exportLeadsCsv);
router.patch('/:id', requireAuth, updateLead);
router.delete('/:id', requireAuth, deleteLead);

export default router;
