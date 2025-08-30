# Architecture

- **Express** app with feature-focused routers.
- **Sequelize** ORM using SQLite for easy local setup.
- **JWT Auth**: `authMiddleware` verifies token, `requireSuperadmin` checks role membership.
- **Audit logs**: Central `logAudit` helper writes events for create/update/delete/assign-role.
- **Tests**: Jest + Supertest (auth, users basic flows).
- **Docs**: Postman collection in `/postman` folder.
