import { Inject, Injectable } from '@nestjs/common';
import { CreateRediDto } from './dto/create-redi.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  create = async (createRediDto: CreateRediDto) => {
    if (createRediDto.ttl && createRediDto.ttl > 1000) {
      await this.cacheManager.set(
        createRediDto.key,
        createRediDto.value,
        createRediDto.ttl,
      );
    } else {
      await this.cacheManager.set(createRediDto.key, createRediDto.value);
    }
    return {
      message: `${createRediDto.key} is settled in cache`,
    };
  };

  clearAll = async () => {
    await this.cacheManager.reset();
    return { message: 'clear' };
  };

  findOne = async (id: string) => {
    const fromCache = await this.cacheManager.get(id);
    return fromCache;
  };

  remove = async (id: string) => {
    await this.cacheManager.del(id);
    return { message: `removed ${id}` };
  };
}
