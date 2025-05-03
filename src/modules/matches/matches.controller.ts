import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('recent')
  async getRecentMatches(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.matchesService.getRecentMatches(page, pageSize);
  }

  @Get('next')
  async getNextMatches() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.matchesService.getNextMatches();
  }
}
