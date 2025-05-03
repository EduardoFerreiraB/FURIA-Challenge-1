import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @ApiOperation({ summary: 'Obter as ultimas noticias da FURIA' })
  @ApiResponse({
    status: 200,
    description: 'Ultimas noticias da FURIA',
    schema: {
      example: [
        {
          title: 'FURIA contrata Yekindar',
          date: '2025-05-01',
          link: 'https://www.furia.gg/noticias/furia-contrata-yekindar',
        },
        {
          title: 'FURIA vence o Major',
          date: '2025-05-02',
          link: 'https://www.furia.gg/noticias/furia-vence-o-major',
        },
      ],
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  async getNews() {
    return this.newsService.getNews();
  }
}
