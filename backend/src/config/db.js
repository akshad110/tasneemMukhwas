import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  if (env.mongodbUri.includes('<') || env.mongodbUri.includes('password>')) {
    throw new Error(
      'Set a real MONGODB_URI in backend/.env (replace the placeholder username/password/cluster).',
    )
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongodbUri)
  console.log(`MongoDB connected: ${mongoose.connection.name}`)
}
