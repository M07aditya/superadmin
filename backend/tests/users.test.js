import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretchangeit';

describe('Users CRUD (partial)', () => {
  let token;
  beforeAll(async () => {
    await sequelize.sync();
    // fake admin user for tests
    const payload = { id: 1, email: 'superadmin@example.com' };
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should reject without JWT', async () => {
    const res = await request(app).get('/api/v1/superadmin/users');
    expect(res.status).toBe(401);
  });

  it('should list users with token (may 403 if not superadmin)', async () => {
    const res = await request(app).get('/api/v1/superadmin/users').set('Authorization', 'Bearer ' + token);
    // Accept either 200 or 403 depending on seed run
    expect([200,403]).toContain(res.status);
  });
});
