import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import mongoose from "mongoose";
import { redisConnection } from "../config/redis";
import Post from "../models/posts.model";



const publishMissedPosts = async () => {
  console.log("🔍 Checking for missed scheduled posts...");

  const now = new Date();

  const missedPosts = await Post.find({
    status: "PENDING",
    scheduledTime: { $lte: now },
  });

  for (const post of missedPosts) {
    try {
      console.log("⏰ Publishing missed post:", post.content);
       await sleep(5000); 
      post.status = "PUBLISHED";
      await post.save();
    } catch (err) {
      post.status = "FAILED";
      await post.save();
    }
  }

  console.log(`✅ Recovery complete. Processed ${missedPosts.length} posts`);
};


// 🔥 CONNECT DB FIRST
(async () => {
  try {

    
    console.log("⏳ Worker connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Worker MongoDB connected");

    await publishMissedPosts();


    const worker = new Worker(
      "post-queue",
      async (job) => {
        const { postId } = job.data;

        const post = await Post.findById(postId);
        if (!post) return;

        try {
          console.log("📤 Publishing post:", post.content);

          post.status = "PUBLISHED";
          await post.save();
        } catch (err) {
          post.status = "FAILED";
          await post.save();
          throw err;
        }
      },
      { connection: redisConnection }
    );

    worker.on("completed", (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
      console.error(`❌ Job ${job?.id} failed`, err);
    });

  } catch (err) {
    console.error("❌ Worker startup failed", err);
    process.exit(1);
  }
})();
function sleep(arg0: number) {
  throw new Error("Function not implemented.");
}

