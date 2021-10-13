import { BotCommand, EParseMode } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot, InlineKeyboard } from "grammy";

export class SubscriberCommand implements BotCommand {
  
  // public _messageBuilder
  public _messageBuilder() {
    return {
      text: _escapeCharacters("*Subscriber menu*"),
      options: {
        parse_mode: EParseMode.MARKDOWNV2,
        reply_markup: new InlineKeyboard()
          // Subscriber Menu
          .text("Subscribe to tags", "subscriberCreate")
          .text("Edit/Delete Subscribes", "subscriberMenu-subscribersKeyboard")
          .text("How to use this?")
          
          .row()
          // Back button
          .text("⬅️ To main menu", "openStartMenu")
      }
    };
  };

  // Initialize command function
  initialize(bot: Bot) {    
    // subscriber command
    bot.command("subscribers", (ctx) => {
      const message = this._messageBuilder();
      ctx.reply(message.text, message.options);
    });
  }
}
