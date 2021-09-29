import { BotCommand } from '@app/services';
import { Bot } from 'grammy';

export class StartCommand implements BotCommand {
  initialize(bot: Bot) {
    bot.command('start', (ctx) => {
      ctx.reply('Start command!');
    })
  };
};