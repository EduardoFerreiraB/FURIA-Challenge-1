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
    const url = 'https://www.hltv.org/team/8297/furia#tab-newsBox';
    const selector = '.tab-content .subTab-newsArticle';

    const extractor = () => {
      const items = Array.from(
        document.querySelectorAll('.tab-content .subTab-newsArticle'),
      );
      return items.map((item) => {
        let title = item.textContent?.trim() || '';
        const link = 'https://www.hltv.org' + item.getAttribute('href');
        const dateText =
          item.querySelector('.subTab-newsDate')?.textContent?.trim() || '';

        title = title.replace(/^\d{1,2}\/\d{1,2}/, '').trim();

        const [day, month] = dateText.split('/').map(Number);
        const year = new Date().getFullYear();
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return { title, link, date };
      });
    };
    //Scrape the news from HLTV
    const news = await this.scrappingService.scrape<NewsItem[]>(
      url,
      selector,
      extractor,
    );

    const latestNews = news.slice(0, 5);
    await this.fileCacheService.set(cacheKey, latestNews);
    console.log('Cache set');
    return latestNews;
  }
}
