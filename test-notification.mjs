// @ts-nocheck
const axios = require("axios");

async function sendTestNotification() {
  const testWebhookUrl =
    process.env.DISCORD_TEST_WEBHOOK_URL ||
    "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

  const testMessage = {
    embeds: [
      {
        title: "🧪 テスト通知",
        description: "Discord RSS Notifier の動作確認テストです",
        color: 0x00ff00,
        fields: [
          {
            name: "ステータス",
            value: "✅ 正常動作中",
            inline: true,
          },
          {
            name: "時刻",
            value: new Date().toLocaleString("ja-JP"),
            inline: true,
          },
        ],
        footer: {
          text: "RSS Bot Test",
        },
      },
    ],
  };

  try {
    console.log("🚀 テスト通知を送信中...");

    if (testWebhookUrl.includes("YOUR_WEBHOOK")) {
      console.log("⚠️  実際のWebhook URLを設定してください:");
      console.log(
        'export DISCORD_TEST_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"'
      );
      console.log("");
      console.log("📝 送信予定のメッセージ内容:");
      console.log(JSON.stringify(testMessage, null, 2));
      return;
    }

    const response = await axios.post(testWebhookUrl, testMessage);

    if (response.status === 204) {
      console.log("✅ テスト通知の送信が完了しました！");
    } else {
      console.log(`⚠️  予期しないレスポンス: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ 通知送信エラー:", error.message);
    if (error.response) {
      console.error("レスポンス詳細:", error.response.data);
    }
  }
}

sendTestNotification();
