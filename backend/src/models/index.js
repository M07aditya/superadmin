import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dialect = process.env.DB_DIALECT || 'sqlite';
const storage = process.env.DB_STORAGE || './data/dev.sqlite';

export const sequelize = new Sequelize({
  dialect,
  storage,
  logging: false
});

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  hashedPassword: { type: DataTypes.STRING, allowNull: false },
  lastLogin: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

export const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  permissions: { type: DataTypes.JSON, allowNull: true }
}, { timestamps: true });

export const UserRole = sequelize.define('UserRole', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { timestamps: false });

export const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  actorUserId: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  targetType: { type: DataTypes.STRING, allowNull: false },
  targetId: { type: DataTypes.INTEGER, allowNull: true },
  details: { type: DataTypes.JSON, allowNull: true },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, { updatedAt: false, createdAt: false });

export const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING, primaryKey: true },
  value: { type: DataTypes.JSON, allowNull: true }
}, { timestamps: false });

User.belongsToMany(Role, { through: UserRole, as: 'roles' });
Role.belongsToMany(User, { through: UserRole, as: 'users' });

