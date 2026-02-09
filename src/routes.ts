import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import postRoutes from './modules/post/post.routes';
import mediaRoutes from './modules/mediaUploader/media.routes';

const router = Router();

// Define the paths here. 
// Note: We don't need '/api' here, that will be in app.ts
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/media', mediaRoutes);

export default router;