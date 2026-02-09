import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { Media } from '../../models/Media';

// @desc    Upload new media
// @route   POST /api/media
export const uploadMedia = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // 1. Determine the URL (Hybrid: S3 or Local)
  let fileUrl = '';
  // @ts-ignore
  if (req.file.location) {
    // @ts-ignore
    fileUrl = req.file.location; // AWS S3
  } else {
    // Local Filesystem
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  // 2. Save record to MongoDB
  const media = await Media.create({
    userId: req.user.userId,
    url: fileUrl,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });

  res.status(201).json(media);
});

// @desc    Get user's media gallery
// @route   GET /api/media
export const getGallery = asyncHandler(async (req: AuthRequest, res: Response) => {
  const media = await Media.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(media);
});