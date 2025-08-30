import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, Role } from '../models/index.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const authMiddleware = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id, { include: [{ model: Role, as: 'roles' }] });
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireSuperadmin = (req, res, next) => {
  const roles = req.user?.roles?.map(r => r.name) || [];
  if (!roles.includes('superadmin')) {
    return res.status(403).json({ error: 'Forbidden: superadmin only' });
  }
  next();
};
