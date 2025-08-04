import { RSSFeed } from "../types";
import { CacheManager } from "./cacheManager";
import { DiscordNotifier } from "./discordNotifier";
export declare class RSSParser {
    private cacheManager;
    private discordNotifier;
    private parser;
    constructor(cacheManager: CacheManager, discordNotifier: DiscordNotifier);
    checkRSSFeed(feed: RSSFeed): Promise<void>;
}
//# sourceMappingURL=rssParser.d.ts.map