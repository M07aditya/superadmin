import { Router } from 'express';
import { Setting } from '../models/index.js';

const router = Router();

router.get('/:key', async (req, res) => {
  const s = await Setting.findByPk(req.params.key);
  res.json({ key: req.params.key, value: s?.value ?? null });
});

router.put('/:key', async (req, res) => {
  const { value } = req.body;
  const [s, created] = await Setting.upsert({ key: req.params.key, value }, { returning: true });
  res.json({ key: req.params.key, value: value ?? null, created });
});

export default router;
