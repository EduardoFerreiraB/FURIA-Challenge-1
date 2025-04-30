import { Injectable } from '@nestjs/common';
import { ScrappingService } from '../scrapping/scrapping.service';
import { NewsItem } from './interfaces/news.interface';
import { FileCacheService } from '../cache/file-cache.service';
@Injectable()
export class NewsService {
  constructor(
    private readonly scrappingService: ScrappingService,
    private readonly fileCacheService: FileCacheService,
  ) {}

  async getNews(): Promise<NewsItem[]> {
    const cacheKey = 'news';
    const cached = await this.fileCacheService.get<NewsItem[]>(cacheKey);
    if (cached) {
      console.log('Cache hit');
      return cached;
    }

    console.log('Cache miss');
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
        .filter((item) => item.title?.toLowerCase().includes('furia'));
    };
    //Scrape the news from HLTV
    const news = await this.scrappingService.scrape<NewsItem[]>(
      url,
      selector,
      extractor,
    );
    await this.fileCacheService.set(cacheKey, news);
    console.log('Cache set');
    return news;
  }
}
