import { BotCommand, EParseMode } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot, InlineKeyboard } from "grammy";

export class InlineQueryInfoCommand implements BotCommand {
  // public _messageBuilder
  public _messageBuilder() {
    return {
      url: "https://i.giphy.com/media/sNpKvQbkUgU30cC5pF/giphy.mp4",
      options: {
        caption: _escapeCharacters("*Inline query*\n\nЯ умеею искать контент по запросам полльзователя и отправлять понравившуюся картинку в чат.\n\nДля этого вам просто нужно вписать `@leggydog_bot` в чат, нажать пробел и вписывать теги, по которым вы хотите искать картинку!"),
        parse_mode: EParseMode.MARKDOWNV2,
        reply_markup: new InlineKeyboard()
          .switchInline('🔗 Try it in chat', 'rating:s dog feral')
          .row()
          .text("⬅️ To main menu", "openStartMenu")
      },
    };
  };

  initialize(bot: Bot) {};
}
