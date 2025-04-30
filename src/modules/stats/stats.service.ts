import { Injectable } from '@nestjs/common';
import { ScrappingService } from '../scrapping/scrapping.service';
import { FileCacheService } from '../cache/file-cache.service';
import { PlayerStats, TeamStats } from './interfaces/team-stats.interface';

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

  async getPlayerStats(playerName: string): Promise<PlayerStats> {
    const cacheKey = `player-stats-${playerName.toLowerCase()}`;
    const cached = await this.fileCacheService.get<PlayerStats>(cacheKey);
    if (cached) {
      console.log('Cache hit');
      return cached;
    }

    console.log('Cache miss');
    const teamUrl = 'https://www.hltv.org/stats/teams/8297/furia';

    const playerUrl = await this.scrappingService.clickPlayer(
      teamUrl,
      playerName,
    );

    const selector = '.statistics';

    const extractor = (): PlayerStats => {
      const rows = Array.from(document.querySelectorAll('.stats-row'));
      const stats = new Map<string, string>();

      rows.forEach((row) => {
        const key =
          row.querySelector('span:nth-child(1)')?.textContent?.trim() || '';
        const value =
          row.querySelector('span:nth-child(2)')?.textContent?.trim() || '';
        stats.set(key, value);
      });

      return {
        totalKills: parseInt(stats.get('Total kills') || '0'),
        headshotPercentage: parseFloat(
          stats.get('Headshot %')?.replace('%', '') || '0',
        ),
        totalDeaths: parseInt(stats.get('Total deaths') || '0'),
        kdRatio: parseFloat(stats.get('K/D Ratio') || '0'),
        damagePerRound: parseFloat(stats.get('Damage / Round') || '0'),
        grenadeDamagePerRound: parseFloat(
          stats.get('Grenade dmg / Round') || '0',
        ),
        mapsPlayed: parseInt(stats.get('Maps played') || '0'),
        roundsPlayed: parseInt(stats.get('Rounds played') || '0'),
        killsPerRound: parseFloat(stats.get('Kills / round') || '0'),
        assistsPerRound: parseFloat(stats.get('Assists / round') || '0'),
        deathsPerRound: parseFloat(stats.get('Deaths / round') || '0'),
        rating: parseFloat(stats.get('Rating 1.0') || '0'),
      };
    };

    const stats = await this.scrappingService.scrape<PlayerStats>(
      playerUrl,
      selector,
      extractor,
    );

    await this.fileCacheService.set(cacheKey, stats);
    console.log('Cache set');
    return stats;
  }
}
