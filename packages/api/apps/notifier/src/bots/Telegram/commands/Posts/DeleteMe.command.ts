import { BotCommand } from "@app/services";
import { Bot } from "grammy";

export class DeleteMeCommand implements BotCommand {
  initialize(bot: Bot) {
    // Delete-Me CallbackQuery
    bot.callbackQuery("delete-me", async (ctx) => {
      ctx.deleteMessage();
    });
  }
}
