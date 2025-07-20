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
declare function sendToDiscord(article: Article, feedName: string, webhook: string): Promise<void>;
declare function checkRSSFeed(feed: RSSFeed): Promise<void>;
declare function main(): Promise<void>;
export { main, checkRSSFeed, sendToDiscord };
//# sourceMappingURL=index.d.ts.map