import Parser from 'rss-parser';
import axios from 'axios';
import * as fs from 'fs';

interface RSSFeed {
  name: string;
  url: string;
  webhook: string | undefined;
}

interface Article {
  title?: string;
  link?: string;
  contentSnippet?: string;
  summary?: string;
  pubDate?: string;
  isoDate?: string;
}

interface DiscordEmbed {
  title?: string | undefined;
  url?: string | undefined;
  description?: string | undefined;
  color?: number | undefined;
  author?: {
    name: string;
  } | undefined;
  timestamp?: string | undefined;
  footer?: {
    text: string;
  } | undefined;
}

interface DiscordPayload {
  embeds: DiscordEmbed[];
}

interface LastCheckData {
  [url: string]: string;
}

const RSS_FEEDS: RSSFeed[] = [
  // カンファレンス関係
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
  // 技術情報関係
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
  // マネジメント関係
  {
    name: "konifar-zatsu",
    url: "https://konifar-zatsu.hatenadiary.jp/feed",
    webhook: process.env.DISCORD_MANAGEMENT_WEBHOOK_URL,
  },
  {
    name: "megamouth.info",
    url: "https://www.megamouth.info/feed",
    webhook: process.env.DISCORD_MANAGEMENT_WEBHOOK_URL,
  },
];

const parser = new Parser();
const CACHE_FILE = "last_check.json";

function loadLastCheck(): LastCheckData {
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

function saveLastCheck(data: LastCheckData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("キャッシュファイルの保存に失敗:", (error as Error).message);
  }
}

async function sendToDiscord(article: Article, feedName: string, webhook: string): Promise<void> {
  const embed: DiscordEmbed = {
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

  const payload: DiscordPayload = {
    embeds: [embed],
  };

  try {
    await axios.post(webhook, payload);
    console.log(`✅ Discord通知送信成功: ${article.title}`);
  } catch (error) {
    console.error(`❌ Discord通知送信失敗: ${(error as Error).message}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkRSSFeed(feed: RSSFeed): Promise<void> {
  console.log(`🔍 RSSフィードをチェック中: ${feed.name}`);

  try {
    const rssFeed = await parser.parseURL(feed.url);
    const lastCheck = loadLastCheck();
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
    } else {
      console.log("📝 新しい記事はありませんでした");
    }
  } catch (error) {
    console.error(`❌ RSSフィードの取得に失敗: ${(error as Error).message}`);
  }
}

async function main(): Promise<void> {
  console.log("🚀 RSS to Discord Bot を開始します");

  if (!process.env.DISCORD_CONFERENCE_WEBHOOK_URL && !process.env.DISCORD_INFORMATION_WEBHOOK_URL && !process.env.DISCORD_MANAGEMENT_WEBHOOK_URL) {
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

export { main, checkRSSFeed, sendToDiscord };