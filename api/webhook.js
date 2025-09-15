// api/webhook.js
const { Telegraf, Markup } = require("telegraf");

const TOKEN = process.env.TELEGRAM_TOKEN || "8125574694:AAEz7mJJGmeUVPLQn31ZOkUZQutEJhLqB5g";
if (!TOKEN) {
  console.error("TELEGRAM_TOKEN not set");
}

const bot = new Telegraf(TOKEN);

// Простая логика крестики-нолики
let gameState = {}; // храним состояние игры по chatId

function getBoard(chatId) {
  const state = gameState[chatId] || Array(9).fill("⬜");
  return Markup.inlineKeyboard(
    state.map((cell, i) =>
      Markup.button.callback(cell, `move_${i}`)
    ).reduce((rows, button, idx) => {
      const row = Math.floor(idx / 3);
      rows[row] = rows[row] || [];
      rows[row].push(button);
      return rows;
    }, [])
  );
}

// Старт игры
bot.start((ctx) => {
  gameState[ctx.chat.id] = Array(9).fill("⬜");
  ctx.reply("Привет! Игра Крестики-нолики. Твой ход!", getBoard(ctx.chat.id));
});

// Обработка хода игрока
bot.action(/move_(\d+)/, (ctx) => {
  const chatId = ctx.chat.id;
  const idx = parseInt(ctx.match[1]);
  if (!gameState[chatId]) gameState[chatId] = Array(9).fill("⬜");
  if (gameState[chatId][idx] !== "⬜") return ctx.answerCbQuery("Ячейка занята!");

  gameState[chatId][idx] = "❌"; // игрок
  // простой ход компьютера
  const emptyIdx = gameState[chatId].map((v,i)=>v==='⬜'?i:null).filter(v=>v!==null);
  if (emptyIdx.length > 0) {
    const botMove = emptyIdx[Math.floor(Math.random() * emptyIdx.length)];
    gameState[chatId][botMove] = "⭕";
  }

  ctx.editMessageReplyMarkup(getBoard(chatId).reply_markup);
  ctx.answerCbQuery();
});

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("ok");
  try {
    await bot.handleUpdate(req.body);
    return res.status(200).send("ok");
  } catch (err) {
    console.error("processUpdate error:", err);
    return res.status(500).send("error");
  }
};
