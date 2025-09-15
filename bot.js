// bot.js
import { Telegraf, Markup } from "telegraf";

const TOKEN = process.env.TELEGRAM_TOKEN; // лучше хранить в ENV на Vercel
const bot = new Telegraf(TOKEN);

// Вспомогательные структуры для игры
const games = {}; // { chatId: { board: [...], turn: 'X'/'O' } }

function renderBoard(board) {
  return board.map(row => row.map(cell => cell || "⬜").join(" ")).join("\n");
}

function checkWinner(board) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // строки
    [0,3,6], [1,4,7], [2,5,8], // столбцы
    [0,4,8], [2,4,6]           // диагонали
  ];

  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

// Старт игры
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  games[chatId] = { board: Array(9).fill(null), turn: "X" };
  ctx.reply("Привет! Игра Крестики-нолики начинается!\n" +
            renderBoard(games[chatId].board),
            Markup.inlineKeyboard(
              Array.from({ length: 9 }, (_, i) =>
                Markup.button.callback((i+1).toString(), `move_${i}`)
              ),
              { columns: 3 }
            )
  );
});

// Обработка хода
bot.action(/move_(\d+)/, (ctx) => {
  const chatId = ctx.chat.id;
  const game = games[chatId];
  if (!game) return ctx.answerCbQuery("Начни игру командой /start");

  const idx = parseInt(ctx.match[1]);
  if (game.board[idx]) return ctx.answerCbQuery("Ячейка занята");

  game.board[idx] = game.turn;
  const winner = checkWinner(game.board);

  if (winner) {
    ctx.editMessageText(`Победил ${winner}!\n` + renderBoard(game.board));
    delete games[chatId];
    return;
  }

  game.turn = game.turn === "X" ? "O" : "X";
  ctx.editMessageText(renderBoard(game.board),
    Markup.inlineKeyboard(
      Array.from({ length: 9 }, (_, i) =>
        Markup.button.callback(game.board[i] || (i+1).toString(), `move_${i}`)
      ),
      { columns: 3 }
    )
  );
  ctx.answerCbQuery();
});

bot.launch();
console.log("Bot started");

