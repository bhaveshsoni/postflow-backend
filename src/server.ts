import dotenv from 'dotenv';
import express from 'express'; 
import path from 'path'; 
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import apiRoutes from './routes'; 
import app from './app';
import { connectDB } from './config/db';
import { postQueue } from './config/redis';

dotenv.config();


const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); 

    // --- Bull Board Setup ---
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullMQAdapter(postQueue)],
      serverAdapter: serverAdapter,
    });

    app.use('/admin/queues', serverAdapter.getRouter());

    // --- ⚠️ RESTORED THIS LINE (Serving Images) ---
    // Without this, http://localhost:5000/uploads/image.png returns 404
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // --- API Routes ---
    app.use('/api', apiRoutes);

    // --- Start Server ---
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📂 Uploads serving at http://localhost:${PORT}/uploads`);
    });

  } catch (err) {
    console.error('❌ Server failed to start', err);
    process.exit(1);
  }
})();