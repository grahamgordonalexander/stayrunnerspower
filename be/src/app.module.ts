import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseOmModule } from './mongoose.om/mongoose.om.module';
import { CacheRedisModule } from './cache.redis/cache.redis.module';
import { RedisModule } from './redis/redis.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { LocalhostsModule } from './localhosts/localhosts.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { BidsModule } from './bids/bids.module';
import { RoomsModule } from './rooms/rooms.module';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatGateway } from './chat/chat.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { chatResponseModule } from './chatResponse/chatResonse.module';

@Module({
  imports: [
    chatResponseModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MongooseOmModule,
    CountriesModule,
    CitiesModule,
    LocalhostsModule,
    AuthModule,
    CustomersModule,
    BidsModule,
    RoomsModule,
    MulterModule.register({
      dest: './uploads',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // Set to true if using TLS/SSL
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_EMAIL, // Default sender email address
      },
    }),
    // CacheRedisModule,
    // RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
