# Discord RSS Notifier

TypeScript製のDiscord RSS通知Bot。GitHub ActionsとDiscord Webhookを使用してRSSフィードの新着記事を複数のDiscordチャンネルに自動通知します。

## 機能

- **13個のRSSフィード**を3つのカテゴリで監視
- **型安全なTypeScript**実装
- **複数チャンネル対応**（カンファレンス、技術情報、マネジメント）
- **GitHub Actionsによる定期実行**（毎時）
- **重複通知の防止**（キャッシュ機能）
- **豊富なログ出力**

## 監視中のRSSフィード

### 📅 カンファレンス関連 (DISCORD_CONFERENCE_WEBHOOK_URL)
- TSKaigi
- Frontend Conference Tokyo
- Frontend Conference Hokkaido  
- Frontend Conference Kansai

### 💻 技術情報関連 (DISCORD_INFORMATION_WEBHOOK_URL)
- JSer.info
- サイボウズ フロントエンド
- チームラボ フロントエンド
- azukiazusa.dev
- mizchi (Zenn)
- yoshiko (Zenn)
- uhyo (Zenn)
- catnose (sizu.me)

### 👔 マネジメント関連 (DISCORD_MANAGEMENT_WEBHOOK_URL)
- konifar-zatsu
- megamouth.info

## セットアップ

### 1. Discord Webhookの作成

各カテゴリ用に3つのWebhookを作成：

1. 通知を送りたいDiscordチャンネルの設定を開く
2. 「連携サービス」→「ウェブフック」→「新しいウェブフック」
3. 名前を設定（例：Conference Bot, Tech Info Bot, Management Bot）
4. ウェブフックURLをコピーして保存

### 2. GitHub Secretsの設定

GitHubリポジトリで以下の3つのSecretを設定：

| Secret名 | 説明 |
|---------|------|
| `DISCORD_CONFERENCE_WEBHOOK_URL` | カンファレンス情報用WebhookURL |
| `DISCORD_INFORMATION_WEBHOOK_URL` | 技術情報用WebhookURL |
| `DISCORD_MANAGEMENT_WEBHOOK_URL` | マネジメント情報用WebhookURL |

**設定手順:**
1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 「New repository secret」をクリック
3. 上記のSecret名とWebhookURLを設定

### 3. 動作確認

1. すべてのSecretを設定
2. GitHub Actionsタブで「RSS to Discord」ワークフローを確認
3. 「Run workflow」ボタンで手動実行してテスト
4. 各Discordチャンネルに通知が来るか確認

## 開発

### 必要な環境
- Node.js 18以上
- TypeScript 5.0以上

### ローカル開発

```bash
# 依存関係のインストール
npm install

# TypeScriptコンパイル
npm run build

# 開発実行（ts-node）
npm run dev

# 本番実行
npm start

# ビルドファイルのクリーンアップ
npm run clean
```

### フィード追加方法

`src/index.ts`の`RSS_FEEDS`配列に追加：

```typescript
{
  name: "新しいフィード名",
  url: "https://example.com/feed",
  webhook: process.env.DISCORD_INFORMATION_WEBHOOK_URL, // 適切なWebhookを選択
},
```

## カスタマイズ

### 実行間隔の変更

`.github/workflows/rss-check.yml`のcron設定を変更：

```yaml
# 毎時実行（現在の設定）
- cron: '0 * * * *'

# 30分おきに実行  
- cron: '*/30 * * * *'

# 15分おきに実行（パブリックリポジトリのみ）
- cron: '*/15 * * * *'
```

### 通知フォーマットのカスタマイズ

`src/index.ts`の`sendToDiscord`関数を編集：

```typescript
const embed: DiscordEmbed = {
  title: article.title,
  url: article.link,
  description: article.contentSnippet || article.summary || "",
  color: 0x0099ff, // 色を変更
  author: { name: feedName },
  timestamp: article.pubDate || article.isoDate,
  footer: { text: "RSS通知" }
};
```

## トラブルシューティング

### よくあるエラー

**TypeScriptビルドエラー**
```bash
npm run build
```
でエラー内容を確認

**RSSフィードが読み込めない**
- URLが正しいか確認
- HTTPSでアクセス可能か確認

**Discord通知が来ない**
- Webhook URLが正しく設定されているか確認
- GitHub Secretsの名前が正確か確認

**GitHub Actionsが実行されない**
- ワークフローファイルが`.github/workflows/`に正しく配置されているか確認
- YAML構文エラーがないか確認

### ログの確認方法

1. GitHubリポジトリの「Actions」タブ
2. 実行されたワークフローをクリック
3. 「check-rss」ジョブをクリックして詳細ログを確認

## 技術仕様

- **言語**: TypeScript 5.8
- **実行環境**: Node.js 18+
- **CI/CD**: GitHub Actions
- **依存関係**: 
  - rss-parser (RSS解析)
  - axios (HTTP通信)
- **アーキテクチャ**: サーバーレス（GitHub Actions）

## 料金

- **パブリックリポジトリ**: 完全無料
- **プライベートリポジトリ**: 月2000分まで無料（現在の設定なら十分に無料枠内）

## ライセンス

MIT