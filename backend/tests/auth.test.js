import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';
import '../src/seed.js';

describe('Auth', () => {
  beforeAll(async () => {
    await new Promise(r => setTimeout(r, 500)); // wait seed
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should login with seeded superadmin', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'superadmin@example.com',
      password: 'Test1234!'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
