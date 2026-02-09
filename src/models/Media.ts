import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  url: { type: String, required: true },       // The public link (S3 or Local)
  filename: { type: String, required: true },  // Original name
  mimeType: { type: String, required: true },  // e.g., 'image/png'
  size: { type: Number, required: true },      // File size in bytes
  createdAt: { type: Date, default: Date.now },
});

export const Media = mongoose.model('Media', MediaSchema);