import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Socket, io } from 'socket.io-client';

export interface TestEnvironment {
  mongoServer?: MongoMemoryServer;
  socket?: Socket;
  mongoUri?: string;
  cleanup: () => Promise<void>;
}

export const setupTestEnvironment = async (): Promise<TestEnvironment> => {
  try {
    // Close any existing connections
    await mongoose.disconnect();

    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.12',
        downloadDir: '/tmp/mongodb-binaries'
      }
    });

    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    await mongoose.connect(mongoUri);

    const socket: Socket = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket']
    });

    return {
      mongoServer,
      socket,
      mongoUri,
      cleanup: async () => {
        try {
          await mongoose.disconnect();
          await mongoServer.stop();
          socket.disconnect();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  } catch (error) {
    console.error('Test environment setup failed:', error);
    return {
      cleanup: async () => {
        try {
          await mongoose.disconnect();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
    };
  }
};
