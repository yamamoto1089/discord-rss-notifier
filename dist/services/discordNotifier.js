"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordNotifier = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../utils/constants");
class DiscordNotifier {
    static async sendToDiscord(article, feedName, webhook) {
        const embed = {
            title: article.title,
            url: article.link,
            description: article.contentSnippet || article.summary || "",
            color: constants_1.DISCORD_EMBED_COLOR,
            author: {
                name: feedName,
            },
            timestamp: article.pubDate || article.isoDate,
            footer: {
                text: constants_1.FOOTER_TEXT,
            },
        };
        const payload = {
            embeds: [embed],
        };
        try {
            await axios_1.default.post(webhook, payload);
            console.log(`✅ Discord通知送信成功: ${article.title}`);
        }
        catch (error) {
            console.error(`❌ Discord通知送信失敗: ${error.message}`);
        }
    }
}
exports.DiscordNotifier = DiscordNotifier;
//# sourceMappingURL=discordNotifier.js.map