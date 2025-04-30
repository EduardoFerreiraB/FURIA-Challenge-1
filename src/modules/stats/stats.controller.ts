import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PlayerStats, TeamStats } from './interfaces/team-stats.interface';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('team')
  async getTeamStats(): Promise<TeamStats> {
    return this.statsService.getTeamStats();
  }

  @Get('player/:name')
  async getPlayerStats(@Param('name') name: string): Promise<PlayerStats> {
    return this.statsService.getPlayerStats(name);
  }
}
