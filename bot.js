const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8125574694:AAEz7mJJGmeUVPLQn31ZOkUZQutEJhLqB5g";
const PORT = process.env.PORT || 3000;
const URL = "https://telegram-mini-a0u2dzl1k-denis-projects-257bc1bf.vercel.app";

const app = express();

// Создаём бота без polling
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${URL}/bot${TOKEN}`);

// Middleware для получения обновлений
app.use(express.json());
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет! Я бот для игры Крестики-нолики!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
