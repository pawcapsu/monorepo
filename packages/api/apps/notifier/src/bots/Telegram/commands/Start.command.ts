import { TelegramGatewayService } from "../services";
import { BotCommand, EParseMode } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot, InlineKeyboard } from "grammy";

export class StartCommand implements BotCommand {
  initialize(bot: Bot, gateway: TelegramGatewayService) {
    async function _messageBuilder(chat_id?: number) {
      const subscribers = [];
      if (chat_id) {
        subscribers.push(...await gateway.fetchSubscribers(chat_id));
      };

      if (subscribers.length > 0) {
        return {
          text: _escapeCharacters(`*Dashboard*\n\nДоброго времени суток, человек! Надеюсь что на сегодня ты надумал что-то крутое :>\n\n*Кол-во подписок:* ${ subscribers.length } шт.\n_Подписка хранит в себе теги, по которым мы ищем новые картинки для вас._`),
          options: {
            parse_mode: EParseMode.MARKDOWNV2,
            reply_markup: new InlineKeyboard()
              // Menus buttons
              .text("🔭 Subscribers", "openSubscriberMenu")
              .text("ℹ️ Inline search", "openInlineSearchInfoMenu")
              .text("❌ Close", "delete-me")
              .row()
              // Information buttons
              .url("Learn more", "https://services.pawcapsu.ml/leggybot")
              .url("Other services", "https://services.pawcapsu.ml")
          },
        };
      } else {
        return {
          text: _escapeCharacters("*Leggydog*\n\nПриветствую! Я очень рад что ты решил мною попользоваться, это прям невероятно круто и странно звучит! Ладно, проехали эту плохую шутку. Я бот, который будет следить за новыми постами на разных сайтах, и отправлять тебе самый свежий контент! На данный момент я поддерживаю только *E621*, но скоро добавится намного больше сайтов.\n\n\nЯ буду тебе помогать во всём, чём только смогу. Для того, что бы начать пользование, вам нужно зайти в меню `🔭 Subscribers`. Увидимся в этом меню!\n\nТак же я умею искать контент прямо в строке поиска! Зайдите в меню `ℹ️ Inline search` и почитайте про то, как круто и удобно меня использовать!"), 
          options: {
            parse_mode: EParseMode.MARKDOWNV2,
            reply_markup: new InlineKeyboard()
              // Menus buttons
              .text("🔭 Subscribers", "openSubscriberMenu")
              .text("ℹ️ Inline search", "openInlineSearchInfoMenu")
              .text("❌ Close", "delete-me")
              .row()
              // Information buttons
              .url("Learn more", "https://services.pawcapsu.ml/leggybot")
              .url("Other services", "https://services.pawcapsu.ml")
          },
        };
      };
    };

    // Start CallbackQuery
    bot.callbackQuery("openStartMenu", async (ctx) => {
      const message = await _messageBuilder(ctx.update?.callback_query?.message?.chat?.id);
      if (ctx.update.callback_query?.message?.document?.file_id != null) {
        ctx.deleteMessage();
        ctx.reply(message.text, message.options);   
      } else {
        ctx.editMessageText(message.text, message.options);
      }
    });

    // Start command
    bot.command("start", async (ctx) => {
      const message = await _messageBuilder(0);
      ctx.reply(message.text, message.options);
    });

    // Menu command
    bot.command("menu", async (ctx) => {
      const message = await _messageBuilder(ctx.update?.message?.chat?.id);
      ctx.reply(message.text, message.options);
    });
  }
}
