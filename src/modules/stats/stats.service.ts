import { Injectable } from '@nestjs/common';
import { ScrappingService } from '../scrapping/scrapping.service';
import { FileCacheService } from '../cache/file-cache.service';
import { TeamStats } from './interfaces/team-stats.interface';

@Injectable()
export class StatsService {
  constructor(
    private readonly scrappingService: ScrappingService,
    private readonly fileCacheService: FileCacheService,
  ) {}

  async getTeamStats(): Promise<TeamStats> {
    const cacheKey = 'team-stats';
    const cached = await this.fileCacheService.get<TeamStats>(cacheKey);
    if (cached) {
      console.log('Cache hit');
      return cached;
    }

    console.log('Cache miss');
    const url = 'https://www.hltv.org/stats/teams/8297/furia';
    const selector = '.columns .col.standard-box.big-padding';

    const extractor = () => {
      const items = Array.from(
        document.querySelectorAll('.columns .col.standard-box.big-padding'),
      );

      const values = items.map((item) => {
        return item.querySelector('.large-strong')?.textContent?.trim() || '';
      });

      const mapsPlayed = values[0] ? parseInt(values[0].replace(/,/g, '')) : 0;

      const wdl = values[1]
        ? values[1].split(' / ').map((num) => parseInt(num.trim(), 10))
        : [];

      const winRate =
        mapsPlayed > 0
          ? Math.round((wdl[0] / mapsPlayed) * 100 * 100) / 100
          : 0;

      return {
        mapsPlayed,
        wdl,
        totalKills: values[2] ? parseInt(values[2].replace(/,/g, '')) : 0,
        totalDeaths: values[3] ? parseInt(values[3].replace(/,/g, '')) : 0,
        roundsPlayed: values[4] ? parseInt(values[4].replace(/,/g, '')) : 0,
        kdRatio: values[5] ? parseFloat(values[5]) : 0,
        winRate,
      };
    };

    const stats = await this.scrappingService.scrape<TeamStats>(
      url,
      selector,
      extractor,
    );

    await this.fileCacheService.set(cacheKey, stats);
    console.log('Cache set');
    return stats;
  }
}
