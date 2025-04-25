import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './modules/news/news.module';
import { ScrappingModule } from './modules/scrapping/scrapping.module';

@Module({
  imports: [NewsModule, ScrappingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
