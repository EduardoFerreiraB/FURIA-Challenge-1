import { Module } from '@nestjs/common';
import { NewsModule } from './modules/news/news.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrappingModule } from './modules/scrapping/scrapping.module';
import { FileCacheService } from './modules/cache/file-cache.service';
import { StatsModule } from './modules/stats/stats.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({
  imports: [NewsModule, ScrappingModule, StatsModule, MatchesModule],
  controllers: [AppController],
  providers: [AppService, FileCacheService],
  exports: [FileCacheService],
})
export class AppModule {}
