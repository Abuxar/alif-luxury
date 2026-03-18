import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  toggleWishlistItem 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/wishlist').put(protect, toggleWishlistItem);

export default router;
