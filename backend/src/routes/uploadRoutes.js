import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { uploadImages } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.mimetype)) {
      cb(new Error('Only jpg, png, webp, and svg images are allowed.'));
      return;
    }
    cb(null, true);
  }
});

const router = Router();

router.post('/images', requireAuth, upload.array('images', 8), uploadImages);

export default router;
