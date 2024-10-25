import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = () => 
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryAttempts: 3,
        retryDelay: 1000
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
  }
};
