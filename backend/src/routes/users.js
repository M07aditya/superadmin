import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, Role } from '../models/index.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

// GET list with filters, pagination
router.get('/', async (req, res) => {
  const { q, page = 1, pageSize = 10 } = req.query;
  const where = {};
  if (q) {
    where.name = { ['like']: `%${q}%` };
  }
  const offset = (Number(page) - 1) * Number(pageSize);
  const { rows, count } = await User.findAndCountAll({
    where,
    limit: Number(pageSize),
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: Role, as: 'roles' }]
  });
  res.json({ data: rows, total: count, page: Number(page), pageSize: Number(pageSize) });
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [{ model: Role, as: 'roles' }] });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const created = await User.create({ name, email, hashedPassword });
  await logAudit(req.user.id, 'create_user', 'User', created.id, { name, email });
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.hashedPassword = await bcrypt.hash(password, 10);
  await user.save();
  await logAudit(req.user.id, 'update_user', 'User', user.id, { name: user.name, email: user.email });
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  await user.destroy();
  await logAudit(req.user.id, 'delete_user', 'User', Number(req.params.id), { email: user.email });
  res.json({ ok: true });
});

export default router;
