import { TelegramGatewayService } from "../../services";
import { BotCommand, EChannelActionType, EParseMode, EConsumerType } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot, InlineKeyboard } from "grammy";

export class SubscriberCreateCommand implements BotCommand {
  initialize(bot: Bot, gateway: TelegramGatewayService) {
    // Message Builder
    function _messageBuilder() {
      return {
        text: _escapeCharacters("*Создать новую подписку*\n\nСоздавая подписку, вы подписываетесь на определённые теги на сайте *E621*.\n\nВам будут присылаться все новые картинки, вне зависимости от рейтинга, комментариев либо других тегов.\n\nДля того, что бы подписаться на какие-либо теги, *просто впишите в чат теги через пробел*.\n\nСписок всех доступных тегов: [Ссылка](https://e621.net/tags)"),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup:new InlineKeyboard().
          text("Cancel", "cancelSubscriberCreation")
        },
      };
    };
    
    // SubscriberCreate CallbackQuery
    bot.callbackQuery("subscriberCreate", async (ctx) => {
      const message = _messageBuilder();

      // Setting current channel action
      const chat_id = ctx.update.callback_query?.message?.chat?.id;
      if (!chat_id) return;

      await gateway.setCurrentChannelAction(String(chat_id), {
        type: EChannelActionType.CREATE_SUBSCRIBER,
        data: {
          messageId: ctx.update.callback_query?.message?.message_id
        }
      });

      // Editing message
      ctx.editMessageText(message.text, message.options);
    });

    // CancelSubscriberCreation CallbackQuery
    bot.callbackQuery("cancelSubscriberCreation", async (ctx) => {
      // Deleting current channel action
      const chat_id = ctx.update.callback_query?.message?.chat?.id;
      if (!chat_id) return;

      await gateway.deleteCurrentChannelAction(String(chat_id));
    
      // +todo openStartMenu
    });

    // Listening for chat message
    bot.on("message", async (ctx) => {
      const chat_id = ctx.update.message?.chat?.id;
      if (!chat_id) return;

      const action = (await gateway.getCurrentChannelAction(String(chat_id)));
      if (action && action.type === EChannelActionType.CREATE_SUBSCRIBER) {
        const tags = ctx.update.message.text.split(" ");

        // Creating new subscriber
        await gateway.addSubscriber({
          type: EConsumerType.TELEGRAM,
          chatId: String(chat_id),
        }, tags);

        // Deleting current channel action
        await gateway.deleteCurrentChannelAction(String(chat_id));

        ctx.api.deleteMessage(chat_id, action.data.messageId);
        // Opening successMenu
        if (action.data.messageId) {
          ctx.reply(_escapeCharacters(`*Вы подписали на теги*\n\`${ tags.join(", ") }\`\n\nТеперь я буду отправлять вам все самые новые картинки по этим тегам, ура-ура-ура!\n\nВ ближайшие несколько минут придёт ваша самая первая картинка, в которой будет описанно что с ней можно делать дальше.\n\nОсталось просто подождать!`), {
            parse_mode: EParseMode.MARKDOWNV2,
            reply_markup: new InlineKeyboard()
              .text("Go to main menu", "openStartMenu")
          });
        };
      };
    });
  }
}
