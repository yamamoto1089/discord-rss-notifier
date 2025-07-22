"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSSParser = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
const cacheManager_1 = require("./cacheManager");
const discordNotifier_1 = require("./discordNotifier");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../utils/constants");
class RSSParser {
    static async checkRSSFeed(feed) {
        console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);
        try {
            const rssFeed = await this.parser.parseURL(feed.url);
            const lastCheck = cacheManager_1.CacheManager.loadLastCheck();
            const lastCheckTime = lastCheck[feed.url]
                ? new Date(lastCheck[feed.url])
                : new Date(0);
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
                    return dateA.getTime() - dateB.getTime();
                });
                for (const article of newArticles) {
                    if (feed.webhook) {
                        await discordNotifier_1.DiscordNotifier.sendToDiscord(article, feed.name, feed.webhook);
                        await (0, helpers_1.sleep)(constants_1.RATE_LIMIT_DELAY);
                    }
                }
                lastCheck[feed.url] = new Date().toISOString();
                cacheManager_1.CacheManager.saveLastCheck(lastCheck);
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
RSSParser.parser = new rss_parser_1.default();
//# sourceMappingURL=rssParser.js.map