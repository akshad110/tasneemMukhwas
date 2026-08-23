# Taskeen Mukhwas API

## Setup

1. Copy `.env.example` to `.env` (already created) and set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - admin credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, …)
2. Install & run:

```bash
cd backend
npm install
npm run ensure-admin
npm run dev
```

Add products via the admin panel. To wipe all commerce data and start fresh:

```bash
npm run clear-commerce
```

API base: `http://localhost:5000/api`

## Auth

- `POST /api/auth/register` — customer signup
- `POST /api/auth/login` — login (admin or customer)
- `GET /api/auth/me` — current user (Bearer token)
- `PATCH /api/auth/profile` — update profile/settings

Admin routes require `Authorization: Bearer <token>` and `role: admin`.

## Resources

| Method | Path | Access |
|--------|------|--------|
| GET | `/products` | Public |
| GET | `/products/:id` | Public |
| POST/PATCH/DELETE | `/products` | Admin |
| POST | `/orders` | Public (checkout) |
| GET/PATCH | `/orders...` | Admin |
| GET | `/customers` | Admin |
| GET | `/transactions` | Admin |
| GET | `/dashboard` | Admin |
| GET | `/health` | Public |
