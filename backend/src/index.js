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
    message: { success: false, message: 'Too many requests, try again later' },
  }),
)

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      ok: true,
      db: isDbConnected() ? 'connected' : 'connecting',
    },
  })
})

app.use('/api', apiRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

async function boot() {
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`API listening on port ${env.port}`)
  })

  const connected = await connectDBWithRetry()
  if (connected) {
    startNotificationCleanupJob()
  } else {
    console.error(
      'MongoDB never connected — check MONGODB_URI on Render and Atlas Network Access (allow 0.0.0.0/0).',
    )
  }
}

boot().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
