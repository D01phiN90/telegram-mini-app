// api/webhook.js
const TelegramBot = require("node-telegram-bot-api");

module.exports = async (req, res) => {
  try {
    const TOKEN = process.env.TELEGRAM_TOKEN;
    if (!TOKEN) {
      console.error("TELEGRAM_TOKEN is missing");
      return res.status(500).send("Bot token not set");
    }

    // создаём бота внутри handler
    const bot = new TelegramBot(TOKEN, { polling: false });

    // если пришёл апдейт от Telegram
    if (req.method === "POST") {
      await bot.processUpdate(req.body);
      return res.status(200).send("ok");
    }

    return res.status(200).send("hello from webhook");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("error");
  }
};
