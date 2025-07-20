"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.checkRSSFeed = checkRSSFeed;
exports.sendToDiscord = sendToDiscord;
const rss_parser_1 = __importDefault(require("rss-parser"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const RSS_FEEDS = [
    {
        name: "TSKaigi",
        url: "https://tskaigi.hatenablog.com/feed",
        webhook: process.env.DISCORD_CONFERENCE_WEBHOOK_URL,
    },
    {
        name: "Frontend Conference Tokyo",
        url: "https://note.com/fec_tokyo/rss",
        webhook: process.env.DISCORD_CONFERENCE_WEBHOOK_URL,
    },
    {
        name: "Frontend Conference Hokkaido",
        url: "https://note.com/fec_hokkaido/rss",
        webhook: process.env.DISCORD_CONFERENCE_WEBHOOK_URL,
    },
    {
        name: "Frontend Conference Kansai",
        url: "https://github.com/fec-kansai.atom",
        webhook: process.env.DISCORD_CONFERENCE_WEBHOOK_URL,
    },
    {
        name: "JSer.info",
        url: "https://jser.info/rss/",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "サイボウズ フロントエンド",
        url: "https://zenn.dev/p/cybozu_frontend/feed",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "チームラボ フロントエンド",
        url: "https://zenn.dev/p/teamlab_fe/feed",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "azukiazusa.dev",
        url: "https://azukiazusa.dev/rss.xml",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "mizchi",
        url: "https://zenn.dev/mizchi/feed",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "yoshiko",
        url: "https://zenn.dev/yoshiko/feed",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "uhyo",
        url: "https://zenn.dev/uhyo/feed",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
    {
        name: "catnose",
        url: "https://sizu.me/catnose/rss",
        webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL,
    },
];
const parser = new rss_parser_1.default();
const CACHE_FILE = "last_check.json";
function loadLastCheck() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf8");
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.log("キャッシュファイルの読み込みに失敗:", error.message);
    }
    return {};
}
function saveLastCheck(data) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.log("キャッシュファイルの保存に失敗:", error.message);
    }
}
async function sendToDiscord(article, feedName, webhook) {
    const embed = {
        title: article.title,
        url: article.link,
        description: article.contentSnippet || article.summary || "",
        color: 0x0099ff,
        author: {
            name: feedName,
        },
        timestamp: article.pubDate || article.isoDate,
        footer: {
            text: "RSS通知",
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
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function checkRSSFeed(feed) {
    console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);
    try {
        const rssFeed = await parser.parseURL(feed.url);
        const lastCheck = loadLastCheck();
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
                    await sendToDiscord(article, feed.name, feed.webhook);
                    await sleep(1000);
                }
            }
            lastCheck[feed.url] = new Date().toISOString();
            saveLastCheck(lastCheck);
        }
        else {
            console.log("📝 新しい記事はありませんでした");
        }
    }
    catch (error) {
        console.error(`❌ RSSフィードの取得に失敗: ${error.message}`);
    }
}
async function main() {
    console.log("🚀 RSS to Discord Bot を開始します");
    if (!process.env.DISCORD_CONFERENCE_WEBHOOK_URL && !process.env.DISCORD_INFORMATION_WEBHOOK_URL) {
        console.error("❌ Discord Webhook URL環境変数が設定されていません");
        process.exit(1);
    }
    for (const feed of RSS_FEEDS) {
        if (!feed.webhook) {
            console.error(`❌ ${feed.name}のWebhook URLが設定されていません`);
            continue;
        }
        await checkRSSFeed(feed);
        await sleep(2000);
    }
    console.log("✅ すべてのRSSフィードのチェックが完了しました");
}
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map