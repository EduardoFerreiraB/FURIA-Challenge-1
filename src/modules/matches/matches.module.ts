import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { ScrappingModule } from '../scrapping/scrapping.module';

@Module({
  imports: [ScrappingModule],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
