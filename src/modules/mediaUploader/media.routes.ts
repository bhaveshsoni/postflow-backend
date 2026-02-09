import express from 'express';
import { uploadMedia, getGallery } from './media.controller'; // Update imports if needed
import { upload } from '../../common/middleware/uploadMiddleware'; // Adjust path to middleware
import { protect } from '../../common/middleware/auth.middleware'; // Adjust path to auth

const router = express.Router();

router.route('/')
  .post(protect, upload.single('image'), uploadMedia)
  .get(protect, getGallery);

export default router; // 👈 This line is likely missing or incorrect!