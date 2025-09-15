// api/webhook.js
const { Telegraf, Markup } = require("telegraf");

const TOKEN = process.env.TELEGRAM_TOKEN;
if (!TOKEN) {
  throw new Error("TELEGRAM_TOKEN is not set");
}

const bot = new Telegraf(TOKEN);

// /start команда
bot.start((ctx) => {
  ctx.reply(
    "Привет! Я бот с мини-игрой 'Крестики-нолики'. Нажми кнопку ниже 👇",
    Markup.inlineKeyboard([
      Markup.button.webApp(
        "Играть 🎮",
        "https://D01phiN90.github.io/telegram-mini-app"
      ),
    ])
  );
});

// Обработчик апдейтов
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send("ok");
    } catch (err) {
      console.error("Ошибка в webhook:", err);
      res.status(500).send("error");
    }
  } else {
    res.status(200).send("Bot is running");
  }
};
