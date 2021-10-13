import { BotEvent } from "@app/services";
import { Bot } from "grammy";

export class StartupEvent implements BotEvent {
  initialize(bot: Bot) {
    bot.api.setMyCommands([
      {
        command: "menu",
        description: "Main menu",
      },
      {
        command: "subscribers",
        description: "Your Subscribes",
      },
    ]);
  }
}
