import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_platform';

  // If USE_MEMORY_DB is explicitly set to false, connect directly to MongoDB URI
  if (process.env.USE_MEMORY_DB === 'false') {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[MongoDB] Connected successfully to ${uri}`);
      return;
    } catch (err) {
      console.error(`[MongoDB] Connection error to ${uri}:`, err.message);
      throw err;
    }
  }

  // Otherwise, try connecting to MONGODB_URI first; if it fails, fallback to MongoMemoryServer
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    console.warn(`[MongoDB] Local MongoDB at ${uri} not reachable (${err.message}).`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback (mongodb-memory-server)...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB at ${memUri}`);
    } catch (memErr) {
      console.error('[MongoDB] Failed to start in-memory database:', memErr.message);
      console.error('[MongoDB] Please ensure MongoDB is running or configure MONGODB_URI in backend/.env');
      throw memErr;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Disconnect error:', err.message);
  }
};
