import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { connectDBWithRetry, isDbConnected } from './config/db.js'
import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { startNotificationCleanupJob } from './services/notificationCleanup.js'

const app = express()

app.set('trust proxy', 1)

function healthPayload() {
  return {
    success: true,
    data: {
      ok: true,
      db: isDbConnected() ? 'connected' : 'connecting',
      env: env.nodeEnv,
      port: env.port,
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
  console.log(
    `[boot] node=${process.version} env=${env.nodeEnv} port=${env.port} render=${Boolean(process.env.RENDER)}`,
  )

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`API listening on 0.0.0.0:${env.port}`)
  })

  const connected = await connectDBWithRetry()
  if (connected) {
    startNotificationCleanupJob()
  } else {
    console.error(
      'MongoDB never connected — verify MONGODB_URI matches local Atlas string and Atlas Network Access allows 0.0.0.0/0.',
    )
  }
}

boot().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
