import { RSS_FEEDS } from './config/feeds';
import { RSSParser } from './services/rssParser';
import { DiscordNotifier } from './services/discordNotifier';
import { sleep } from './utils/helpers';
import { FEED_CHECK_DELAY } from './utils/constants';

async function main(): Promise<void> {
  console.log("🚀 RSS to Discord Bot を開始します");

  if (!process.env.DISCORD_CONFERENCE_WEBHOOK_URL && !process.env.DISCORD_INFORMATION_WEBHOOK_URL && !process.env.DISCORD_MANAGEMENT_WEBHOOK_URL) {
    console.error("❌ Discord Webhook URL環境変数が設定されていません");
    process.exit(1);
  }

  const rssParser = new RSSParser();

  for (const feed of RSS_FEEDS) {
    if (!feed.webhook) {
      console.error(`❌ ${feed.name}のWebhook URLが設定されていません`);
      continue;
    }
    await rssParser.checkRSSFeed(feed);
    await sleep(FEED_CHECK_DELAY);
  }

  console.log("✅ すべてのRSSフィードのチェックが完了しました");
}

if (require.main === module) {
  main().catch(console.error);
}

export { main, DiscordNotifier, RSSParser };