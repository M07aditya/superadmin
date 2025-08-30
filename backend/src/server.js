import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './models/index.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
