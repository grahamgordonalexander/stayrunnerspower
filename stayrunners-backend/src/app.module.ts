import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BotModule } from './bot/bot.module';
import { WebsocketModule } from './websocket/websocket.module';
import appConfig from './config/app.config';
import groqConfig from './config/groq.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://127.0.0.1:27017/stayrunners',
        connectionFactory: (connection) => {
          // Add any mongoose plugins here if needed
          return connection;
        },
        maxPoolSize: 10,
        minPoolSize: 2,
        retryAttempts: 3,
        retryDelay: 1000
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/public/views'),
      serveRoot: '/',
      serveStaticOptions: {
        index: ['views/index.html'],
      },
    }),
    BotModule,
    WebsocketModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
