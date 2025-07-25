export interface RSSFeed {
  name: string;
  url: string;
  webhook?: string;
}

export interface Article {
  title?: string;
  link?: string;
  contentSnippet?: string;
  summary?: string;
  pubDate?: string;
  isoDate?: string;
}

export interface DiscordEmbed {
  title?: string;
  url?: string;
  description?: string;
  color?: number;
  author?: {
    name: string;
  };
  timestamp?: string;
  footer?: {
    text: string;
  };
}

export interface DiscordPayload {
  embeds: DiscordEmbed[];
}

export interface LastCheckData {
  [url: string]: string;
}