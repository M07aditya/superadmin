# Super Admin Backend

Express + Sequelize (SQLite) implementation for Super Admin APIs.

## Quick start

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

Server runs on `http://localhost:${PORT:-4000}`.

### Seeded superadmin (for review only)
- **email**: superadmin@example.com
- **password**: Test1234!

## Endpoints (base `/api/v1`)
- POST `/auth/login`
- Users under `/superadmin/users`
- Roles under `/superadmin/roles` and `/superadmin/assign-role`
- Audit logs under `/superadmin/audit-logs`
- Analytics under `/superadmin/analytics/summary`
- Settings under `/superadmin/settings/:key`

All endpoints (except `/auth/login`) require JWT and role === `superadmin`.
