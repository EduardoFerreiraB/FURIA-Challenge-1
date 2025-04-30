import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { ScrappingModule } from '../scrapping/scrapping.module';
import { FileCacheModule } from '../cache/file-cache.module';

@Module({
  imports: [ScrappingModule, FileCacheModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
