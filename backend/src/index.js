import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { connectDBWithRetry, isDbConnected } from './config/db.js'
import { env, logEnvDiagnostics, missingEnvKeys } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { startNotificationCleanupJob } from './services/notificationCleanup.js'

const app = express()

app.set('trust proxy', 1)

function healthPayload() {
  const missing = missingEnvKeys()
  return {
    success: missing.length === 0,
    data: {
      ok: true,
      ready: missing.length === 0 && isDbConnected(),
      db: isDbConnected() ? 'connected' : env.mongodbUri ? 'connecting' : 'not_configured',
      env: env.nodeEnv,
      port: env.port,
      missingEnv: missing,
    },
  }
}

/** Health checks first — before middleware that can fail behind Render proxy. */
app.get('/', (_req, res) => {
  res.json(healthPayload())
})
app.get('/health', (_req, res) => {
  res.json(healthPayload())
})
app.get('/api/health', (_req, res) => {
  res.json(healthPayload())
})

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'],
  }),
)
app.use(express.json({ limit: '12mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.use('/api', (req, res, next) => {
  const missing = missingEnvKeys()
  if (missing.length) {
    return res.status(503).json({
      success: false,
      message: `Server misconfigured. Missing env: ${missing.join(', ')}`,
    })
  }
  if (!isDbConnected() && req.path !== '/health') {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting. Try again in a few seconds.',
    })
  }
  return next()
})

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
    message: { success: false, message: 'Too many requests, try again later' },
  }),
)

app.use('/api', apiRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

process.on('unhandledRejection', (reason) => {
  console.error('[process] unhandledRejection', reason)
})
process.on('uncaughtException', (err) => {
  console.error('[process] uncaughtException', err)
})

async function boot() {
  logEnvDiagnostics()
  console.log(`[boot] node=${process.version}`)

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`API listening on 0.0.0.0:${env.port}`)
  })

  if (missingEnvKeys().length) return

  const connected = await connectDBWithRetry()
  if (connected) {
    startNotificationCleanupJob()
  } else {
    console.error(
      'MongoDB never connected — copy the exact MONGODB_URI from local backend/.env and allow 0.0.0.0/0 in Atlas Network Access.',
    )
  }
}

boot().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
