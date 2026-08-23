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
npm run ensure-admin
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
  - `MONGODB_URI` — **exact same** Atlas string as local `.env` (check database name spelling, e.g. `tasneen_mukhwas`)
  - `JWT_SECRET` — long random secret
  - `CLIENT_URL` = `https://tasneemmukhwas.onrender.com`
  - `NODE_ENV` = `production`
  - **Do NOT set `PORT`** — delete it from Render env; Render assigns `PORT` automatically (manual `PORT=5000` causes 502)
- **Root Directory must be `backend`** (or use repo root — root `package.json` delegates to backend)

**If you see 502:** open Render → API service → Logs. Common fixes: remove `PORT` env var, set Root Directory to `backend`, redeploy.

After first deploy, from Render shell or locally against Atlas: `npm run ensure-admin`

To remove demo/seeded commerce data: `npm run clear-commerce`

### Static Site (UI) — `frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Rewrite:** `/*` → `/index.html`
- **Env:** `VITE_API_URL=https://<your-api>.onrender.com/api`

Set backend `CLIENT_URL` to your static site URL (e.g. `https://tasneemmukhwas.onrender.com`). The API also allows that Render URL by default; set `CLIENT_URL` explicitly if you use a custom domain.
