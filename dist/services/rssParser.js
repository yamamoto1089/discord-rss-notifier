"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSSParser = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
class RSSParser {
    constructor(cacheManager, discordNotifier) {
        this.cacheManager = cacheManager;
        this.discordNotifier = discordNotifier;
        this.parser = new rss_parser_1.default();
    }
    async checkRSSFeed(feed) {
        console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);
        try {
            const rssFeed = await this.parser.parseURL(feed.url);
            const lastCheck = this.cacheManager.loadLastCheck();
            const lastCheckDate = lastCheck[feed.url];
            const lastCheckTime = lastCheckDate ? new Date(lastCheckDate) : new Date(0);
            const newArticles = [];
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
                    await this.discordNotifier.sendToDiscord(latestArticle, feed.name, feed.webhook);
                }
                lastCheck[feed.url] = new Date().toISOString();
                this.cacheManager.saveLastCheck(lastCheck);
            }
            else {
                console.log("📝 新しい記事はありませんでした");
            }
        }
        catch (error) {
            console.error(`❌ RSSフィードの取得に失敗: ${error.message}`);
        }
    }
}
exports.RSSParser = RSSParser;
//# sourceMappingURL=rssParser.js.map