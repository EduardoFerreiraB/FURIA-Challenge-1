/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
puppeteer.use(StealthPlugin());

@Injectable()
export class ScrappingService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;
  private readonly logger = new Logger(ScrappingService.name);

  async onModuleInit(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: true });
    this.logger.log('Browser iniciado com sucesso.');
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: true });
      this.logger.warn('Browser reiniciado após estar null.');
    }
    return this.browser;
  }

  private async getPage(): Promise<Page> {
    const browser = await this.getBrowser();
    return await browser.newPage();
  }

  async scrape<T>(
    url: string,
    selector: string,
    extractor: () => T,
    timeout = 60000,
  ): Promise<T> {
    const page = await this.getPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitForSelector(selector, { timeout });

      const result = await page.evaluate(extractor);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao fazer scraping em: ${url}`, error);
      throw new Error(`Scraping failed for ${url}: ${error}`);
    } finally {
      await page.close();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Browser fechado com sucesso.');
    }
  }
}
