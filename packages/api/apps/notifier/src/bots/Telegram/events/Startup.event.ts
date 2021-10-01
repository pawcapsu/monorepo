import { BotEvent } from "@app/services";
import { Bot } from "grammy";

export class StartupEvent implements BotEvent {
  initialize(bot: Bot) {
    bot.api.setMyCommands([
      {
        command: 'start',
        description: 'Get bot-related information',
      },
      {
        command: 'subscribers',
        description: 'Menu, where you can configure which images this bot will send to this channel',
      },
    ]);
  }
}
