import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');
const backendDir = path.join(rootDir, 'backend');

dotenv.config({ path: path.join(backendDir, '.env') });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  storageDriver:
    process.env.STORAGE_DRIVER || (process.env.DATABASE_URL ? 'postgres' : 'file'),
  databaseUrl: process.env.DATABASE_URL || '',
  autoInitDb: String(process.env.AUTO_INIT_DB || 'true').toLowerCase() === 'true',
  shopNotificationEmail: process.env.SHOP_NOTIFICATION_EMAIL || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  dataFile: process.env.DATA_FILE || path.join(rootDir, 'backend', 'src', 'data', 'store.json')
};
