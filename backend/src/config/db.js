import mongoose from 'mongoose'
import { env } from './env.js'

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set')
  }
  if (env.mongodbUri.includes('<') || env.mongodbUri.includes('password>')) {
    throw new Error(
      'Set a real MONGODB_URI in Render environment (replace placeholder username/password/cluster).',
    )
  }

  if (isDbConnected()) return

  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 15_000,
    socketTimeoutMS: 45_000,
  })
  console.log(`MongoDB connected: ${mongoose.connection.name}`)
}

const RETRY_MS = 5_000
const MAX_RETRIES = 12

/** Keep retrying MongoDB in the background after HTTP server is already listening. */
export async function connectDBWithRetry() {
  if (!env.mongodbUri) {
    console.error('[db] Skipping connect — MONGODB_URI is not set')
    return false
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await connectDB()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`MongoDB connect attempt ${attempt}/${MAX_RETRIES} failed: ${message}`)
      if (attempt >= MAX_RETRIES) return false
      await new Promise((resolve) => setTimeout(resolve, RETRY_MS))
    }
  }
  return false
}
