/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileCacheService {
  private cacheFilePath = path.join(process.cwd(), 'cache.json');

  constructor() {
    this.cacheFilePath = path.join(process.cwd(), 'cache.json');
    console.log('Cache file path:', this.cacheFilePath);
    // Inicializa o arquivo de cache, se não existir
    if (!fs.existsSync(this.cacheFilePath)) {
      fs.writeFileSync(this.cacheFilePath, JSON.stringify({}));
      console.log('Cache file created:', this.cacheFilePath);
    } else {
      console.log('Cache file already exists:', this.cacheFilePath);
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const cache = this.readCache();
    console.log('Cache GET:', key, cache[key]);
    return cache[key];
  }

  async set<T>(key: string, value: T): Promise<void> {
    const cache = this.readCache();
    cache[key] = value;
    console.log('Cache SET:', key, value);
    this.writeCache(cache);
  }

  private readCache(): Record<string, any> {
    const data = fs.readFileSync(this.cacheFilePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeCache(cache: Record<string, any>): void {
    fs.writeFileSync(this.cacheFilePath, JSON.stringify(cache, null, 2));
  }
}
