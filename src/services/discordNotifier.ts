import axios from 'axios';
import { Article, DiscordEmbed, DiscordPayload } from '../types';
import { DISCORD_EMBED_COLOR, FOOTER_TEXT } from '../utils/constants';

export class DiscordNotifier {
  async sendToDiscord(
    article: Article, 
    feedName: string, 
    webhook: string
  ): Promise<void> {
    const embed: DiscordEmbed = {
      title: article.title,
      url: article.link,
      description: article.contentSnippet || article.summary || "",
      color: DISCORD_EMBED_COLOR,
      author: {
        name: feedName,
      },
      timestamp: article.pubDate || article.isoDate,
      footer: {
        text: FOOTER_TEXT,
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
}