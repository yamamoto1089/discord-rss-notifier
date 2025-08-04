import { RSSFeed } from "../types";

export const RSS_FEEDS: RSSFeed[] = [
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
  {
    name: "Jxck Blog",
    url: "https://blog.jxck.io/feeds/atom.xml",
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
