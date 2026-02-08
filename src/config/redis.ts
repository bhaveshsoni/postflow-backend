import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

// 1. The Connection (You just fixed this ✅)
export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

// 2. The Queue (Export this so Server & Worker can use it!)
export const postQueue = new Queue('post-upload', { 
  connection: redisConnection 
});

// 3. Graceful Shutdown
export const closeQueue = async () => {
  await postQueue.close();
  await redisConnection.quit();
};