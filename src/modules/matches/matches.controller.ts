import { Controller, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('recent')
  async getRecentMatches() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.matchesService.getRecentMatches();
  }
}
