import { BotEvent } from "@app/services";
import { Bot } from "grammy";

export class InlineKeyboardCallbackEvent implements BotEvent {
  initialize(bot: Bot) {
    // delete-me callbackQuery
    bot.callbackQuery("delete-me", async (ctx) => {
      await ctx.deleteMessage();
    });
  }
}
