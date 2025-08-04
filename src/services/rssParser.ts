import Parser from "rss-parser";
import { Article, RSSFeed } from "../types";
import { CacheManager } from "./cacheManager";
import { DiscordNotifier } from "./discordNotifier";

export class RSSParser {
  private parser = new Parser();

  constructor(
    private cacheManager: CacheManager,
    private discordNotifier: DiscordNotifier
  ) {}

  async checkRSSFeed(feed: RSSFeed): Promise<void> {
    console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);

    try {
      const rssFeed = await this.parser.parseURL(feed.url);
      const lastCheck = this.cacheManager.loadLastCheck();
      const lastCheckDate = lastCheck[feed.url];
      const lastCheckTime = lastCheckDate
        ? new Date(lastCheckDate)
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

        newArticles.sort((a, b) => {
          const dateStringA = a.pubDate || a.isoDate;
          const dateStringB = b.pubDate || b.isoDate;
          const dateA = dateStringA ? new Date(dateStringA) : new Date(0);
          const dateB = dateStringB ? new Date(dateStringB) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        const latestArticle = newArticles[0];
        if (feed.webhook && latestArticle) {
          await this.discordNotifier.sendToDiscord(
            latestArticle,
            feed.name,
            feed.webhook
          );
        }

        lastCheck[feed.url] = new Date().toISOString();
        this.cacheManager.saveLastCheck(lastCheck);
      } else {
        console.log("📝 新しい記事はありませんでした");
      }
    } catch (error) {
      console.error(`❌ RSSフィードの取得に失敗: ${(error as Error).message}`);
    }
  }
}
