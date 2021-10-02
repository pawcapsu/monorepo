import { TelegramGatewayService } from "../../services";
import { BotCommand } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot } from "grammy";

export class LikePostCommand implements BotCommand {
  initialize(bot: Bot, gateway: TelegramGatewayService) {
    // Delete-Me CallbackQuery
    // bot.callbackQuery("delete-me", async (ctx) => {
    //   ctx.deleteMessage();
    // });
  }
}
