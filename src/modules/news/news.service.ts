import { Injectable } from '@nestjs/common';
import { ScrappingService } from '../scrapping/scrapping.service';
import { NewsItem } from './interfaces/news.interface';

@Injectable()
export class NewsService {
  private cache: NewsItem[] = [];
  private lastUpdate: number | null = null;
  private readonly cacheDuration = 1000 * 60 * 60 * 3; // 3 hours

  constructor(private readonly scrappingService: ScrappingService) {}

  async getNews(): Promise<NewsItem[]> {
    const now = Date.now();
    // Check if the cache is still valid
    // If the cache is still valid, return the cached data
    // If the cache is not valid, fetch new data
    if (this.lastUpdate && now - this.lastUpdate < this.cacheDuration) {
      return this.cache;
    }

    const url = 'https://www.hltv.org';
    const selector = '.standard-box.standard-list .newsline.article';

    const extractor = () => {
      const items = Array.from(
        document.querySelectorAll(
          '.standard-box.standard-list .newsline.article',
        ),
      );
      return items
        .map((item) => {
          const title =
            item.querySelector('.newstext')?.textContent?.trim() || '';
          const link = 'https://www.hltv.org' + item.getAttribute('href');
          return { title, link };
        })
        .filter((item) => item.title?.toLowerCase().includes('falcons'));
    };
    //Scrape the news from HLTV
    const news = await this.scrappingService.scrape<NewsItem[]>(
      url,
      selector,
      extractor,
    );
    //Update the cache
    this.cache = news;
    this.lastUpdate = now;

    return news;
  }
}
