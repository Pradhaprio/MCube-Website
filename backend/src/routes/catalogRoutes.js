import { Router } from 'express';
import {
  createCatalogItem,
  deleteCatalogItem,
  getCatalogItem,
  listCatalog,
  updateCatalogItem
} from '../controllers/catalogController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listCatalog);
router.get('/:slug', getCatalogItem);
router.post('/', requireAuth, createCatalogItem);
router.put('/:id', requireAuth, updateCatalogItem);
router.delete('/:id', requireAuth, deleteCatalogItem);

export default router;
