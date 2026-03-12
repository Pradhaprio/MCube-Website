import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { readStore } from '../services/dataStore.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const data = await readStore();
    const owner = data.owners.find((item) => item.id === payload.sub && item.isActive);
    if (!owner) {
      return res.status(401).json({ message: 'Session is no longer valid.' });
    }
    req.owner = owner;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}
