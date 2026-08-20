# Tasneem Mukhwas

Monorepo layout:

```
frontend/   # Vite + React shop & admin UI
backend/    # Express + MongoDB API
```

## Local setup

### Backend
```bash
cd backend
cp .env.example .env   # set MONGODB_URI + JWT_SECRET
npm install
npm run seed:force
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

## Render deployment

### Web Service (API) — `backend`
- **Root Directory:** `backend`
- **Runtime:** Node 20+
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health check path:** `/api/health`
- **Env (required on Render):**
  - `MONGODB_URI` — Atlas connection string
  - `JWT_SECRET` — long random secret
  - `CLIENT_URL` = `https://tasneemmukhwas.onrender.com`
  - `NODE_ENV` = `production`

**If you see 502:** open Render → API service → Logs. Usually `Missing required env variable: MONGODB_URI` or MongoDB Atlas blocking Render (Network Access → allow `0.0.0.0/0`).

After first deploy, from Render shell or locally against Atlas: `npm run seed:force`

### Static Site (UI) — `frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Rewrite:** `/*` → `/index.html`
- **Env:** `VITE_API_URL=https://<your-api>.onrender.com/api`

Set backend `CLIENT_URL` to your static site URL (e.g. `https://tasneemmukhwas.onrender.com`). The API also allows that Render URL by default; set `CLIENT_URL` explicitly if you use a custom domain.
