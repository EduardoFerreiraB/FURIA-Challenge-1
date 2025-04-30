import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TeamStats } from './interfaces/team-stats.interface';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('team')
  async getTeamStats(): Promise<TeamStats> {
    return this.statsService.getTeamStats();
  }
}
