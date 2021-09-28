import { BotEvent } from "libs/services/src";
import { Bot } from 'grammy';

export class MessageEvent implements BotEvent {
  initialize(bot: Bot) {
    bot.on('message', (ctx) => {
      ctx.reply('Got another message!');
    });
  };
};