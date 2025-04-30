import { Module } from '@nestjs/common';
import { FileCacheService } from '../cache/file-cache.service';

@Module({
  providers: [FileCacheService],
  exports: [FileCacheService],
})
export class FileCacheModule {}
