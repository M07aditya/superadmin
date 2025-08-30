import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, Role } from '../models/index.js';

dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, include: [{ model: Role, as: 'roles' }] });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.hashedPassword);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  user.lastLogin = new Date();
  await user.save();
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, email: user.email, roles: user.roles.map(r => r.name) } });
});

export default router;
