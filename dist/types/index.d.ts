export interface RSSFeed {
    name: string;
    url: string;
    webhook: string | undefined;
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
export interface DiscordPayload {
    embeds: DiscordEmbed[];
}
export interface LastCheckData {
    [url: string]: string;
}
//# sourceMappingURL=index.d.ts.map