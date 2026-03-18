import express from 'express';
import { getSettings, updateAnnouncement } from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSettings);
// Only admins can update the announcement bar
router.route('/announcement').put(protect, admin, updateAnnouncement);

export default router;
