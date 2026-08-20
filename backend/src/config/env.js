import dotenv from 'dotenv'

dotenv.config()

function readEnv(name) {
  const value = process.env[name]
  return value && String(value).trim() ? String(value).trim() : ''
}

function normalizeOrigin(value) {
  const trimmed = String(value).trim()
  if (!trimmed) return ''
  try {
    return new URL(trimmed).origin
  } catch {
    return trimmed.replace(/\/$/, '')
  }
}

function parseClientOrigins() {
  const fromEnv = (readEnv('CORS_ORIGINS') || readEnv('CLIENT_URL'))
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)

  const defaults = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://tasneemmukhwas.onrender.com',
    'https://www.tasneemmukhwas.com',
    'https://tasneemmukhwas.com',
  ]

  return [...new Set([...fromEnv, ...defaults])]
}

function resolvePort() {
  const port = Number(process.env.PORT)
  if (port && !Number.isNaN(port)) return port
  return process.env.NODE_ENV === 'production' ? 10000 : 5000
}

export const env = {
  port: resolvePort(),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: readEnv('MONGODB_URI'),
  jwtSecret: readEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: normalizeOrigin(readEnv('CLIENT_URL') || 'http://localhost:5173'),
  clientOrigins: parseClientOrigins(),
  adminName: process.env.ADMIN_NAME || 'Admin Tasneem',
  adminEmail: readEnv('ADMIN_EMAIL'),
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  adminPhone: readEnv('ADMIN_PHONE'),
  razorpayKeyId:
    readEnv('RAZORPAY_KEY_ID') ||
    readEnv('RAZORPAY_API_KEY') ||
    readEnv('RAZOPAY_API_KEY'),
  razorpayKeySecret: readEnv('RAZORPAY_KEY_SECRET') || readEnv('RAZORPAY_SECRET_KEY'),
  resendApiKey: readEnv('RESEND_API_KEY'),
  mailFrom: readEnv('MAIL_FROM') || 'Tasneem Mukhwas <info@tasneemmukhwas.com>',
  resendSandboxTo: readEnv('RESEND_SANDBOX_TO'),
  mailTestTo: readEnv('MAIL_TEST_TO'),
}

const REQUIRED_KEYS = ['MONGODB_URI', 'JWT_SECRET']

export function missingEnvKeys() {
  return REQUIRED_KEYS.filter((key) => {
    if (key === 'MONGODB_URI') return !env.mongodbUri
    if (key === 'JWT_SECRET') return !env.jwtSecret
    return false
  })
}

export function logEnvDiagnostics() {
  const missing = missingEnvKeys()
  console.log(
    `[env] nodeEnv=${env.nodeEnv} port=${env.port} render=${Boolean(process.env.RENDER)} missing=[${missing.join(', ')}]`,
  )
  if (missing.length) {
    console.error(
      `[env] Add these in Render → Environment: ${missing.join(', ')} then redeploy.`,
    )
  }
}
