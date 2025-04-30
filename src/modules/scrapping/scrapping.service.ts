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

  async clickPlayer(
    url: string,
    playerName: string,
    timeout = 60000,
  ): Promise<string> {
    const page = await this.getPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      );

      await page.waitForSelector('.col.teammate', { timeout });

      const linkSelector = await page.evaluate((playerName) => {
        const players = document.querySelectorAll('.col.teammate');
        console.log('Quantidade de players encontrados:', players.length);
        console.log('Jogadores encontrados:');
        for (const player of players) {
          const nameElement = player.querySelector(
            '.image-and-label',
          ) as HTMLElement;
          console.log('Nome do jogador:', nameElement?.innerText.trim());
          if (nameElement && nameElement.innerText.trim() === playerName) {
            const link = player.querySelector('a');
            return link?.getAttribute('href') || null;
          }
        }
        return null;
      }, playerName);

      if (!linkSelector) {
        throw new Error(`Player ${playerName} not found`);
      }

      console.log(`Link do jogador ${playerName}: ${linkSelector}`);

      await page.goto(`https://www.hltv.org${linkSelector}`, {
        waitUntil: 'networkidle2',
      });

      const newPageUrl = page.url();
      this.logger.log(`Nova URL após clicar no jogador: ${newPageUrl}`);
      return newPageUrl;
    } catch (error) {
      this.logger.error(`Erro ao clicar no jogador: ${playerName}`, error);
      throw new Error(`Click failed for player ${playerName}: ${error}`);
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
