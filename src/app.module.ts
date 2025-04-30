import { Module } from '@nestjs/common';
import { NewsModule } from './modules/news/news.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrappingModule } from './modules/scrapping/scrapping.module';
import { FileCacheService } from './modules/cache/file-cache.service';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [NewsModule, ScrappingModule, StatsModule],
  controllers: [AppController],
  providers: [AppService, FileCacheService],
  exports: [FileCacheService],
})
export class AppModule {}
