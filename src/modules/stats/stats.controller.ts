import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PlayerStats, TeamStats } from './interfaces/team-stats.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @ApiOperation({ summary: 'Obter estatísticas do time FURIA' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do time FURIA',
    schema: {
      example: {
        mapsPlayed: 100,
        vitorias: 50,
        derrotas: 7,
        TotalDeKills: 1000,
        TotalDeMortes: 800,
        TaxaDeVitoria: 0.5,
        kdRatio: 1.25,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('team')
  async getTeamStats(): Promise<TeamStats> {
    return this.statsService.getTeamStats();
  }

  @ApiOperation({ summary: 'Obter estatísticas de um jogador da FURIA' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do jogador x da FURIA',
    schema: {
      example: {
        playerName: 'FalleN',
        totalDeKills: 100,
        headshotPercentage: 0.5,
        totaldeMortes: 80,
        kdRatio: 1.25,
        damagePerRound: 80,
        granadeDamagePerRound: 20,
        mapasJogados: 50,
        roundsJogados: 100,
        rating: 1.2,
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('player/:name')
  async getPlayerStats(@Param('name') name: string): Promise<PlayerStats> {
    return this.statsService.getPlayerStats(name);
  }
}
