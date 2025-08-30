import { Router } from 'express';
import { AuditLog, User } from '../models/index.js';
const router = Router();

router.get('/', async (req, res) => {
  const { userId, action, from, to, page = 1, pageSize = 20 } = req.query;
  const where = {};
  if (userId) where.actorUserId = userId;
  if (action) where.action = action;
  if (from || to) {
    where.timestamp = {};
    if (from) where.timestamp['$gte'] = new Date(from);
    if (to) where.timestamp['$lte'] = new Date(to);
  }
  const offset = (Number(page) - 1) * Number(pageSize);
  const { rows, count } = await AuditLog.findAndCountAll({
    where,
    offset,
    limit: Number(pageSize),
    order: [['timestamp', 'DESC']]
  });
  res.json({ data: rows, total: count, page: Number(page), pageSize: Number(pageSize) });
});

export default router;
