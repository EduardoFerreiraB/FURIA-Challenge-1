import { Controller, Get, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}
  @ApiOperation({ summary: 'Obter os ultimos jogos da FURIA' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Tamanho da página',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos ultimos jogos da FURIA',
    schema: {
      example: {
        matches: [
          {
            date: '2025-04-09',
            team1: 'FURIA',
            team2: 'The MongolZ',
            score: 'FURIA 0 : 2 The MongolZ',
            matchLink:
              'https://www.hltv.org/matches/2381321/furia-vs-the-mongolz-pgl-bucharest-2025',
          },
        ],
        total: 17,
        page: 1,
        pageSize: 5,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Get('recent')
  async getRecentMatches(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.matchesService.getRecentMatches(page, pageSize);
  }

  @ApiOperation({ summary: 'Obter os proximos jogos da FURIA' })
  @ApiResponse({
    status: 200,
    description: 'Lista dos proximos jogos da FURIA',
    schema: {
      example: [
        {
          date: '2025-05-10',
          team1: 'FURIA',
          team2: 'The MongolZ',
          matchLink:
            'https://www.hltv.org/matches/2382203/the-mongolz-vs-furia-pgl-astana-2025',
        },
      ],
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('next')
  async getNextMatches() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.matchesService.getNextMatches();
  }
}
