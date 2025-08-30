import { Router } from 'express';
import { Role, User } from '../models/index.js';
import { logAudit } from '../utils/audit.js';

const router = Router();

router.get('/', async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
});

router.post('/', async (req, res) => {
  const { name, permissions = [] } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const created = await Role.create({ name, permissions });
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ error: 'Not found' });
  const { name, permissions } = req.body;
  if (name) role.name = name;
  if (permissions) role.permissions = permissions;
  await role.save();
  res.json(role);
});

router.post('/assign-role', async (req, res) => {
  const { userId, roleId } = req.body;
  const user = await User.findByPk(userId);
  const role = await Role.findByPk(roleId);
  if (!user || !role) return res.status(400).json({ error: 'Invalid userId or roleId' });
  await user.addRole(role);
  await logAudit(req.user.id, 'assign_role', 'User', user.id, { role: role.name });
  res.json({ ok: true });
});

export default router;
