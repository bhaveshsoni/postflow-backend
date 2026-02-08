import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  content: string;
  scheduledTime: Date;
  status: "PENDING" | "PUBLISHED" | "FAILED";
  platform: "FACEBOOK" | "INSTAGRAM" | "LINKEDIN";
  userId: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    scheduledTime: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "PUBLISHED", "FAILED"],
      default: "PENDING",
    },
    platform: {
      type: String,
      enum: ["FACEBOOK", "INSTAGRAM", "LINKEDIN"],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
