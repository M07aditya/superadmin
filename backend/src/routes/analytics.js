import { Router } from 'express';
import { User, Role } from '../models/index.js';
import { Op } from 'sequelize';

const router = Router();

router.get('/summary', async (req, res) => {
  const [usersCount, rolesCount, logins7d] = await Promise.all([
    User.count(),
    Role.count(),
    User.count({ where: { lastLogin: { [Op.gte]: new Date(Date.now() - 7*24*60*60*1000) } } })
  ]);
  res.json({ usersCount, rolesCount, activeUsers7d: logins7d });
});

export default router;
