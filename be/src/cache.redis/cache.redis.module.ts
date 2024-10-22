import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import { /*CacheInterceptor */ CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
// import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: 24 * 60 * 60 * 1000, // Set TTL to 1 day (24 hours) in milliseconds
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR, //For Auto-caching
    //   useClass: CacheInterceptor, //For Auto-caching
    // },
  ],
})
export class CacheRedisModule {}
