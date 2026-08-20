# Render — copy these settings when creating the API web service

## API (Web Service)
- Name: tasneemmukhwas-api
- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

### Required environment variables
| Key | Example |
|-----|---------|
| MONGODB_URI | copy exact value from local `backend/.env` |
| JWT_SECRET | copy exact value from local `backend/.env` |
| CLIENT_URL | https://tasneemmukhwas.onrender.com |
| NODE_ENV | production |

### Do NOT set
- **PORT** — Render sets this automatically. Manual PORT causes 502.

### After deploy
Open `https://<your-api>.onrender.com/api/health`

If `missingEnv` lists keys, add them in Render Environment and redeploy.

If `db` stays `connecting`, fix Atlas Network Access (allow 0.0.0.0/0).

---

## Frontend (Static Site)
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Env: `VITE_API_URL=https://<your-api>.onrender.com/api`
