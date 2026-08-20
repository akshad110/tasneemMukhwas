# Render setup & troubleshooting

## Use ONE API web service only
Delete duplicate API services (`tasneemMukhwas-api`, `tasneemMukhwas-bg-api`, old `tasneemmukhwas-api`, etc.).  
Keep **one** service only.

**Critical:** type must be **Web Service** (not Background Worker).  
Background Workers do **not** serve HTTP — you will get 404/502 forever.

---

## API (Web Service) settings
| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | Node |
| Branch | `main` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Auto-Deploy | Yes |

### Required env vars
| Key | Value |
|-----|--------|
| `MONGODB_URI` | exact copy from local `backend/.env` |
| `JWT_SECRET` | exact copy from local `backend/.env` |
| `CLIENT_URL` | `https://tasneemmukhwas.onrender.com` |
| `NODE_ENV` | `production` |

**Do NOT set `PORT`** — delete it if present.

### GitHub repo
Must be: `akshad110/tasneemMukhwas` branch `main`  
(Settings → Build & Deploy → Connected repository)

---

## If status is "Running" but nothing redeploys
1. Open the service → **Events** tab  
2. Check the latest event — is it an old commit? Does a new deploy appear after `git push`?  
3. **Manual Deploy** → **Clear build cache & deploy** (not just "Restart")  
4. If no new deploy starts: Settings → disconnect and reconnect GitHub repo  
5. Confirm the latest commit on GitHub is `fa83a4f` or newer

---

## After deploy — test
`https://<your-api-service-name>.onrender.com/api/health`

Expected JSON:
```json
{"success":true,"data":{"ok":true,"ready":true,"db":"connected",...}}
```

If `missingEnv` has keys → add env vars → redeploy.  
If `db` is `connecting` → fix Atlas Network Access (allow `0.0.0.0/0`).

---

## Frontend (Static Site)
| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| `VITE_API_URL` | `https://<your-api-service-name>.onrender.com/api` |

**Redeploy frontend** after changing `VITE_API_URL` (it is baked in at build time).
