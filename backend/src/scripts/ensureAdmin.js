/**
 * Ensures the admin account from .env exists with the correct password.
 * Migrates legacy admin@tasneemmukhwas.com → ADMIN_EMAIL when needed.
 * Run: npm run ensure-admin
 */
import { connectDB } from '../config/db.js'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

async function ensureAdmin() {
  await connectDB()

  const adminEmail = env.adminEmail.toLowerCase()
  const legacyAdminEmails = [
    'admin@tasneemmukhwas.com',
    process.env.ADMIN_FUTURE_EMAIL,
    'akshavengurlekar35@gmail.com',
    'akshadvengurlekar35@gmail.com',
  ]
    .filter(Boolean)
    .map((e) => String(e).trim().toLowerCase())
    .filter((e, i, arr) => arr.indexOf(e) === i && e !== adminEmail)

  for (const email of legacyAdminEmails) {
    const legacy = await User.findOne({ email })
    if (legacy && legacy.role !== 'admin') {
      await User.deleteOne({ _id: legacy._id })
      console.log(`Removed customer account: ${email}`)
    }
  }

  const customerConflict = await User.findOne({ email: adminEmail, role: { $ne: 'admin' } })
  if (customerConflict) {
    await User.deleteOne({ _id: customerConflict._id })
    console.log(`Removed customer using admin email: ${adminEmail}`)
  }

  let admin = await User.findOne({ email: adminEmail }).select('+password')

  if (!admin) {
    const legacyAdmin = await User.findOne({
      email: { $in: legacyAdminEmails },
      role: 'admin',
    }).select('+password')

    if (legacyAdmin) {
      console.log(`Migrating admin ${legacyAdmin.email} → ${adminEmail}`)
      legacyAdmin.email = adminEmail
      legacyAdmin.role = 'admin'
      legacyAdmin.name = env.adminName
      legacyAdmin.isActive = true
      if (env.adminPassword) legacyAdmin.password = env.adminPassword
      if (env.adminPhone) legacyAdmin.phone = env.adminPhone
      await legacyAdmin.save()
      admin = legacyAdmin
    }
  }

  if (!admin) {
    admin = await User.create({
      name: env.adminName,
      email: adminEmail,
      password: env.adminPassword,
      phone: env.adminPhone,
      role: 'admin',
    })
    console.log(`Admin created: ${adminEmail}`)
  } else {
    admin.role = 'admin'
    admin.name = env.adminName
    admin.isActive = true
    if (env.adminPassword) admin.password = env.adminPassword
    if (env.adminPhone) admin.phone = env.adminPhone
    await admin.save()
    console.log(`Admin ensured: ${adminEmail}`)
  }

  const ok = await admin.comparePassword(env.adminPassword)
  console.log(`Password check: ${ok ? 'OK' : 'FAILED'}`)

  const staleAdmins = await User.find({ role: 'admin', email: { $ne: adminEmail } })
  for (const stale of staleAdmins) {
    await User.deleteOne({ _id: stale._id })
    console.log(`Removed stale admin: ${stale.email}`)
  }

  const admins = await User.find({ role: 'admin' }).select('email isActive').lean()
  console.log('Admin accounts in database:')
  for (const a of admins) {
    console.log(`  - ${a.email}${a.isActive ? '' : ' (inactive)'}`)
  }

  process.exit(ok ? 0 : 1)
}

ensureAdmin().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
