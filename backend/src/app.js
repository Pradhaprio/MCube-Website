import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { readStore } from './services/dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(morgan(env.nodeEnv === 'test' ? 'tiny' : 'dev'));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

  app.get('/api/health', async (req, res) => {
    const data = await readStore();
    res.json({
      status: 'ok',
      catalogCount: data.catalogItems.length,
      leadCount: data.leads.length
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/store', storeRoutes);
  app.use('/api/catalog', catalogRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use(errorHandler);

  return app;
}
