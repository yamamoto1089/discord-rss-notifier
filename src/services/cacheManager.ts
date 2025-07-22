import * as fs from 'fs';
import { LastCheckData } from '../types';
import { CACHE_FILE } from '../utils/constants';

export class CacheManager {
  static loadLastCheck(): LastCheckData {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, "utf8");
        return JSON.parse(data) as LastCheckData;
      }
    } catch (error) {
      console.log("キャッシュファイルの読み込みに失敗:", (error as Error).message);
    }
    return {};
  }

  static saveLastCheck(data: LastCheckData): void {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("キャッシュファイルの保存に失敗:", (error as Error).message);
    }
  }
}