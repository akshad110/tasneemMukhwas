import dotenv from 'dotenv'

dotenv.config()

function required(name) {
  const value = process.env[name]
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env variable: ${name}`)
  }
  return String(value).trim()
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminName: process.env.ADMIN_NAME || 'Admin Tasneem',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  adminPhone: process.env.ADMIN_PHONE || '',
  razorpayKeyId:
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_API_KEY ||
    process.env.RAZOPAY_API_KEY ||
    '',
  razorpayKeySecret:
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_SECRET_KEY ||
    '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  mailFrom: process.env.MAIL_FROM || 'Tasneem Mukhwas <support@tasneemmukhwas.com>',
  /**
   * Resend sandbox (onboarding@resend.dev) only delivers to the account owner's email.
   * Set RESEND_SANDBOX_TO to that address in development.
   */
  resendSandboxTo: process.env.RESEND_SANDBOX_TO || '',
  mailTestTo: process.env.MAIL_TEST_TO || '',
}
