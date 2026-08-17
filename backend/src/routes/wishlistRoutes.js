import { Router } from 'express'
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  wishlistBodySchema,
} from '../controllers/wishlistController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', authenticate, getWishlist)
router.post('/', authenticate, validate(wishlistBodySchema), addToWishlist)
router.delete('/:productId', authenticate, removeFromWishlist)

export default router
