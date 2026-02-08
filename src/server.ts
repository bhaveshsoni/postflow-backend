import dotenv from 'dotenv';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { postQueue } from './config/redis'; // Import your queue

dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(); // 🔥 DB FIRST
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    // 2. Create the Board
    createBullBoard({
      queues: [new BullMQAdapter(postQueue)],
      serverAdapter: serverAdapter,
    });

    app.use('/admin/queues', serverAdapter.getRouter());

    console.log('📊 Queue Dashboard running on /admin/queues');
  } catch (err) {
    console.error('❌ Server failed to start', err);
    process.exit(1);
  }
})();
