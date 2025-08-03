# RSS to Discord Bot セットアップ手順

## 1. Discord Webhookの作成

1. Discordで通知を送りたいチャンネルの設定を開く
2. 「連携サービス」→「ウェブフック」→「新しいウェブフック」
3. 名前を設定（例：RSS Bot）
4. ウェブフックURLをコピーして保存

## 2. GitHubリポジトリの作成

1. GitHubで新しいリポジトリを作成（パブリック/プライベートどちらでも可）
2. 以下のファイルを作成：

### ファイル構成
```
your-repo/
├── index.js
├── package.json
├── .github/
│   └── workflows/
│       └── rss-check.yml
└── README.md
```

## 3. GitHub Secretsの設定

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 「New repository secret」をクリック
3. Name: `setting.json`
4. Value: 先ほどコピーしたDiscord WebhookURL
5. 「Add secret」をクリック

## 4. RSSフィードの設定

`index.js` の `RSS_FEEDS` 配列を編集：

```javascript
const RSS_FEEDS = [
  {
    name: "技術ブログ",
    url: "https://zenn.dev/feed",  // 実際のRSSフィードURL
    webhook: process.env.DISCORD_WEBHOOK_URL
  },
  {
    name: "Qiita",
    url: "https://qiita.com/popular-items/feed",
    webhook: process.env.DISCORD_WEBHOOK_URL
  }
];
```

## 5. 動作確認

1. リポジトリに全ファイルをコミット・プッシュ
2. GitHub Actionsタブで「RSS to Discord」ワークフローを確認
3. 「Run workflow」ボタンで手動実行してテスト
4. Discordに通知が来るか確認

## 6. 実行間隔の調整

`.github/workflows/rss-check.yml` のcron設定を変更：

```yaml
# 毎時実行
- cron: '0 * * * *'

# 30分おきに実行  
- cron: '*/30 * * * *'

# 1日3回実行（8時、14時、20時）
- cron: '0 8,14,20 * * *'
```

## トラブルシューティング

### よくあるエラー

**1. RSSフィードが読み込めない**
- URLが正しいか確認
- HTTPSでアクセス可能か確認

**2. Discord通知が来ない**
- Webhook URLが正しく設定されているか確認
- GitHub Secretsの名前が `DISCORD_WEBHOOK_URL` になっているか確認

**3. GitHub Actionsが実行されない**
- ワークフローファイルが `.github/workflows/` に正しく配置されているか確認
- YAML構文エラーがないか確認

### ログの確認方法

1. GitHubリポジトリの「Actions」タブ
2. 実行されたワークフローをクリック
3. 「check-rss」ジョブをクリックして詳細ログを確認

## カスタマイズ

### 複数のDiscordチャンネルに送信
1. GitHub Secretsに `DISCORD_WEBHOOK_URL_2` などを追加
2. `RSS_FEEDS` で異なるwebhookを指定

### 通知の見た目をカスタマイズ
`sendToDiscord` 関数の `embed` オブジェクトを編集：

```javascript
const embed = {
  title: article.title,
  url: article.link,
  description: article.contentSnippet,
  color: 0xff6b6b,  // 色を変更
  author: {
    name: feedName,
    icon_url: "https://example.com/icon.png"
  },
  timestamp: article.pubDate
};
```

## 注意事項

- GitHub Actionsは月2000分まで無料
- RSS更新頻度に合わせて実行間隔を調整
- 大量のフィードを追加する場合は実行時間に注意
- Discord APIレート制限に注意（1秒間隔で送信）
