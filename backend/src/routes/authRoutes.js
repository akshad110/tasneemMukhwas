import { Router } from 'express'
import {
  changePassword,
  forgotPassword,
  login,
  me,
  register,
  registerSchemas,
  updateProfile,
} from '../controllers/authController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/register', validate(registerSchemas.registerSchema), register)
router.post('/login', validate(registerSchemas.loginSchema), login)
router.post('/forgot-password', validate(registerSchemas.forgotPasswordSchema), forgotPassword)
router.get('/me', authenticate, me)
router.patch('/profile', authenticate, validate(registerSchemas.profileSchema), updateProfile)
router.post(
  '/change-password',
  authenticate,
  validate(registerSchemas.changePasswordSchema),
  changePassword,
)
router.get('/admin/me', authenticate, requireAdmin, me)

export default router
