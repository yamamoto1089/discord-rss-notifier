import Parser from 'rss-parser';
import { Article, RSSFeed } from '../types';
import { CacheManager } from './cacheManager';
import { DiscordNotifier } from './discordNotifier';
import { sleep } from '../utils/helpers';
import { RATE_LIMIT_DELAY } from '../utils/constants';

export class RSSParser {
  private static parser = new Parser();

  static async checkRSSFeed(feed: RSSFeed): Promise<void> {
    console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);

    try {
      const rssFeed = await this.parser.parseURL(feed.url);
      const lastCheck = CacheManager.loadLastCheck();
      const lastCheckTime = lastCheck[feed.url]
        ? new Date(lastCheck[feed.url]!)
        : new Date(0);

      const newArticles: Article[] = [];

      for (const item of rssFeed.items) {
        const dateString = item.pubDate || item.isoDate;
        if (dateString) {
          const pubDate = new Date(dateString);
          if (pubDate > lastCheckTime) {
            newArticles.push(item);
          }
        }
      }

      if (newArticles.length > 0) {
        console.log(`📰 新しい記事が ${newArticles.length} 件見つかりました`);

        // Sort articles by date (oldest first)
        newArticles.sort((a, b) => {
          const dateStringA = a.pubDate || a.isoDate;
          const dateStringB = b.pubDate || b.isoDate;
          const dateA = dateStringA ? new Date(dateStringA) : new Date(0);
          const dateB = dateStringB ? new Date(dateStringB) : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });

        // Send notifications for new articles
        for (const article of newArticles) {
          if (feed.webhook) {
            await DiscordNotifier.sendToDiscord(article, feed.name, feed.webhook);
            await sleep(RATE_LIMIT_DELAY);
          }
        }

        // Update cache
        lastCheck[feed.url] = new Date().toISOString();
        CacheManager.saveLastCheck(lastCheck);
      } else {
        console.log("📝 新しい記事はありませんでした");
      }
    } catch (error) {
      console.error(`❌ RSSフィードの取得に失敗: ${(error as Error).message}`);
    }
  }
}