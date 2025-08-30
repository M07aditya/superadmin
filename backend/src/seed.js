import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sequelize, User, Role } from './models/index.js';

dotenv.config();

async function run() {
  await sequelize.sync({ force: true });
  const [superadmin] = await Role.findOrCreate({ where: { name: 'superadmin' }, defaults: { permissions: ['*'] } });
  const password = await bcrypt.hash('Test1234!', 10);
  const admin = await User.create({ name: 'Super Admin', email: 'superadmin@example.com', hashedPassword: password });
  await admin.addRole(superadmin);

  const manager = await Role.create({ name: 'manager', permissions: ['view_users'] });
  const userRole = await Role.create({ name: 'user', permissions: [] });

  console.log('Seeded superadmin@example.com / Test1234!');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
