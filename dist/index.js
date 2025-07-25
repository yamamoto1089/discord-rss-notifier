"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSSParser = exports.DiscordNotifier = void 0;
exports.main = main;
const feeds_1 = require("./config/feeds");
const rssParser_1 = require("./services/rssParser");
Object.defineProperty(exports, "RSSParser", { enumerable: true, get: function () { return rssParser_1.RSSParser; } });
const discordNotifier_1 = require("./services/discordNotifier");
Object.defineProperty(exports, "DiscordNotifier", { enumerable: true, get: function () { return discordNotifier_1.DiscordNotifier; } });
const helpers_1 = require("./utils/helpers");
const constants_1 = require("./utils/constants");
async function main() {
    console.log("🚀 RSS to Discord Bot を開始します");
    if (!process.env.DISCORD_CONFERENCE_WEBHOOK_URL && !process.env.DISCORD_INFORMATION_WEBHOOK_URL && !process.env.DISCORD_MANAGEMENT_WEBHOOK_URL) {
        console.error("❌ Discord Webhook URL環境変数が設定されていません");
        process.exit(1);
    }
    for (const feed of feeds_1.RSS_FEEDS) {
        if (!feed.webhook) {
            console.error(`❌ ${feed.name}のWebhook URLが設定されていません`);
            continue;
        }
        await rssParser_1.RSSParser.checkRSSFeed(feed);
        await (0, helpers_1.sleep)(constants_1.FEED_CHECK_DELAY);
    }
    console.log("✅ すべてのRSSフィードのチェックが完了しました");
}
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map