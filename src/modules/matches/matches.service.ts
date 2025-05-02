import { Injectable } from '@nestjs/common';
import { ScrappingService } from '../scrapping/scrapping.service';

@Injectable()
export class MatchesService {
  constructor(private readonly scrappingService: ScrappingService) {}
  async getRecentMatches(): Promise<any> {
    const url = 'https://www.hltv.org/team/8297/furia#tab-matchesBox';
    const selector = '.table-container.match-table tbody .team-row';

    const extractor = () => {
      const rows = Array.from(
        document.querySelectorAll(
          '.table-container.match-table tbody .team-row',
        ),
      );
      return rows.map((row) => {
        const date =
          row.querySelector('.date-cell span')?.textContent?.trim() || '';
        const team1 =
          row.querySelector('.team-name.team-1')?.textContent?.trim() || '';
        const team2 =
          row.querySelector('.team-name.team-2')?.textContent?.trim() || '';
        const scores = Array.from(
          row.querySelectorAll('.score-cell .score'),
        ).map((score) => score.textContent?.trim() || '0');

        const scoreTeam1 = scores[0] || '0';
        const scoreTeam2 = scores[1] || '0';
        const matchLink =
          row.querySelector('.stats-button-cell a')?.getAttribute('href') || '';

        console.log('Date:', date);
        console.log('Team 1:', team1);
        console.log('Team 2:', team2);
        console.log('Scores:', scores);
        console.log('Score Team 1:', scoreTeam1);
        console.log('Score Team 2:', scoreTeam2);
        console.log('Match Link:', matchLink);
        return {
          date,
          team1,
          team2,
          score: `${team1} ${scoreTeam1} : ${scoreTeam2} ${team2}`,
          matchLink: `https://www.hltv.org${matchLink}`,
        };
      });
    };
    return this.scrappingService.scrape(url, selector, extractor);
  }

  async getNextMatches(): Promise<any> {
    const url = 'https://www.hltv.org/team/8297/furia#tab-matchesBox';
    const selector = '.table-container.match-table tbody .team-row';

    const extractor = () => {
      const rows = Array.from(
        document.querySelectorAll(
          '.table-container.match-table tbody .team-row',
        ),
      );
      return rows
        .filter((row) => {
          const scores = Array.from(
            row.querySelectorAll('.score-cell .score'),
          ).map((score) => score.textContent?.trim() || '');
          return scores[0] === '-' && scores[1] === '-';
        })
        .map((row) => {
          const date =
            row.querySelector('.date-cell span')?.textContent?.trim() || '';
          const team1 =
            row.querySelector('.team-name.team-1')?.textContent?.trim() || '';
          const team2 =
            row.querySelector('.team-name.team-2')?.textContent?.trim() || '';

          const matchLink =
            row.querySelector('.stats-button-cell a')?.getAttribute('href') ||
            '';
          return {
            date,
            team1,
            team2,
            score: `${team1} : ${team2}`,
            matchLink: `https://www.hltv.org${matchLink}`,
          };
        });
    };
    return this.scrappingService.scrape(url, selector, extractor);
  }
}
