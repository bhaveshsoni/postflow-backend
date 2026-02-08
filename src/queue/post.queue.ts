import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const postQueue = new Queue("post-queue", {
  connection: redisConnection,
});
