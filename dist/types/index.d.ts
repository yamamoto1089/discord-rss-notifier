export interface RSSFeed {
    name: string;
    url: string;
    webhook?: string | undefined;
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
    title?: string | undefined;
    url?: string | undefined;
    description?: string;
    color?: number;
    author?: {
        name: string;
    };
    timestamp?: string | undefined;
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
//# sourceMappingURL=index.d.ts.map