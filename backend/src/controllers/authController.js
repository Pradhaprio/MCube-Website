import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { readStore } from '../services/dataStore.js';

export async function login(req, res) {
  const { email = '', password = '' } = req.body;
  const data = await readStore();
  const owner = data.owners.find((item) => item.email.toLowerCase() === String(email).toLowerCase());

  if (!owner || !(await bcrypt.compare(password, owner.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ sub: owner.id, email: owner.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return res.json({
    token,
    owner: {
      id: owner.id,
      email: owner.email,
      fullName: owner.fullName,
      role: owner.role
    }
  });
}

export async function me(req, res) {
  return res.json({
    owner: {
      id: req.owner.id,
      email: req.owner.email,
      fullName: req.owner.fullName,
      role: req.owner.role
    }
  });
}
