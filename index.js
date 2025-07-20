const Parser = require("rss-parser");
const axios = require("axios");
const fs = require("fs");

const RSS_FEEDS = [
  {
    name: "技術ブログ",
    url: "https://zenn.dev/feed",
    webhook: process.env.DISCORD_WEBHOOK_URL,
  },
  {
    name: "Qiita",
    url: "https://qiita.com/popular-items/feed",
    webhook: process.env.DISCORD_WEBHOOK_URL,
  },
];

const parser = new Parser();
const CACHE_FILE = "last_check.json";

function loadLastCheck() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.log("キャッシュファイルの読み込みに失敗:", error.message);
  }
  return {};
}

function saveLastCheck(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
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
    await axios.post(webhook, payload);
    console.log(`✅ Discord通知送信成功: ${article.title}`);
  } catch (error) {
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

    let newArticles = [];

    for (const item of rssFeed.items) {
      const pubDate = new Date(item.pubDate || item.isoDate);
      if (pubDate > lastCheckTime) {
        newArticles.push(item);
      }
    }

    if (newArticles.length > 0) {
      console.log(`📰 新しい記事が ${newArticles.length} 件見つかりました`);

      newArticles.sort((a, b) => {
        const dateA = new Date(a.pubDate || a.isoDate);
        const dateB = new Date(b.pubDate || b.isoDate);
        return dateA - dateB;
      });

      for (const article of newArticles) {
        await sendToDiscord(article, feed.name, feed.webhook);
        await sleep(1000);
      }

      lastCheck[feed.url] = new Date().toISOString();
      saveLastCheck(lastCheck);
    } else {
      console.log("📝 新しい記事はありませんでした");
    }
  } catch (error) {
    console.error(`❌ RSSフィードの取得に失敗: ${error.message}`);
  }
}

async function main() {
  console.log("🚀 RSS to Discord Bot を開始します");

  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.error("❌ DISCORD_WEBHOOK_URL環境変数が設定されていません");
    process.exit(1);
  }

  for (const feed of RSS_FEEDS) {
    await checkRSSFeed(feed);
    await sleep(2000);
  }

  console.log("✅ すべてのRSSフィードのチェックが完了しました");
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, checkRSSFeed, sendToDiscord };
