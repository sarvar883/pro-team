const Telegraf = require('telegraf');
const User = require('./models/user');

// Import botId
const botId = require('./config/keys').botId;

// initialize bot
const bot = new Telegraf(botId);


const startMessage = `
    Это телеграм бот для приложения Pro-Team
    Для начала Вам нужно зарегистрироваться.
    Для этого напишите: /register <EMAIL_ADDRESS>
    Здесь введите email, при помощи которого вы заходите на приложение Pro Team
  `;


bot.command('start', (ctx) => {
  ctx.reply(startMessage);
});


bot.command('register', (ctx) => {
  ctx.reply('Подождите...');
  const input = ctx.message.text.split(' ');
  if (input.length !== 2) {
    return ctx.reply(`
      Вы ввели неправильный формат.
      Напишите: /register <EMAIL_ADDRESS>
      Здесь введите email, при помощи которого вы заходите на приложение Pro Team`);
  }

  const email = input[1];

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return ctx.reply('Пользователь не найден');
      }
      user.tgChat = ctx.chat.id;
      ctx.reply(`Вы зарегистрированы!
          Детали Пользователя:
          Имя: ${user.name}
          Должность: ${user.occupation}
          Телефон: ${user.phone}
        `);
      user.save();
    });
});


module.exports = bot;