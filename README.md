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
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Env:** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `PORT`, admin seed vars

After first deploy, from Render shell or locally against Atlas: `npm run seed:force`

### Static Site (UI) — `frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Rewrite:** `/*` → `/index.html`
- **Env:** `VITE_API_URL=https://<your-api>.onrender.com/api`

Set backend `CLIENT_URL` to your static site URL (e.g. `https://tasneemmukhwas.onrender.com`). The API also allows that Render URL by default; set `CLIENT_URL` explicitly if you use a custom domain.
