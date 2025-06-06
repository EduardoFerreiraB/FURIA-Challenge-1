import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { HttpModule } from '@nestjs/axios';
import { ScrappingModule } from '../scrapping/scrapping.module';
import { FileCacheModule } from '../cache/file-cache.module';

@Module({
  imports: [HttpModule, ScrappingModule, FileCacheModule],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
