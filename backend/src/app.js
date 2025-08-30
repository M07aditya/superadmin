import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, User, Role } from './models/index.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import rolesRouter from './routes/roles.js';
import auditLogsRouter from './routes/auditLogs.js';
import analyticsRouter from './routes/analytics.js';
import settingsRouter from './routes/settings.js';
import { authMiddleware, requireSuperadmin } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRouter);

// Protect all superadmin routes
app.use('/api/v1/superadmin', authMiddleware, requireSuperadmin);

app.use('/api/v1/superadmin/users', usersRouter);
app.use('/api/v1/superadmin/roles', rolesRouter);
app.use('/api/v1/superadmin/audit-logs', auditLogsRouter);
app.use('/api/v1/superadmin/analytics', analyticsRouter);
app.use('/api/v1/superadmin/settings', settingsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;
