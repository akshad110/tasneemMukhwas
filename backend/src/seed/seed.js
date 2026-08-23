/**
 * @deprecated Use `npm run ensure-admin` instead.
 * Ensures the admin account from .env exists — no demo products or orders.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ensureAdmin = path.join(__dirname, '../scripts/ensureAdmin.js')

console.log('Note: seed no longer inserts demo data. Running ensure-admin…')

const result = spawnSync(process.execPath, [ensureAdmin], { stdio: 'inherit' })
process.exit(result.status ?? 1)
