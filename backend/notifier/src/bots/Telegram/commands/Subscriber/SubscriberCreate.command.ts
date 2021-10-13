import { TelegramGatewayService } from "../../services";
import { BotCommand, EChannelActionType, EParseMode, EConsumerType } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { Bot, InlineKeyboard } from "grammy";

export class SubscriberCreateCommand implements BotCommand {
  private gateway: TelegramGatewayService;
  
  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  // public _messageBuilder
  public _messageBuilder(type: "CreateNew" | "Subscribed" | "TagsError", tags?: String[]) {
    if (type === "CreateNew") {
      return {
        text: _escapeCharacters("*Создать новую подписку*\n\nСоздавая подписку, вы подписываетесь на определённые теги на сайте *E621*.\n\nВам будут присылаться все новые картинки, вне зависимости от рейтинга, комментариев либо других тегов.\n\nДля того, что бы подписаться на какие-либо теги, *просто впишите в чат теги через пробел*.\n\nСписок всех доступных тегов: [Ссылка](https://e621.net/tags)"),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup:new InlineKeyboard().
            text("Cancel", "cancelSubscriberCreation")
        },
      };
    } else if (type === "Subscribed") {
      return {
        text: _escapeCharacters(`*Вы подписали на теги*\n\`${ tags.join(", ") }\`\n\nТеперь я буду отправлять вам все самые новые картинки по этим тегам, ура-ура-ура!\n\nВ ближайшие несколько минут придёт ваша самая первая картинка, в которой будет описанно что с ней можно делать дальше.\n\nОсталось просто подождать!`),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: new InlineKeyboard()
            .text("Go to main menu", "openStartMenu")
        },
      };
    } else if (type === "TagsError") {
      return {
        text: _escapeCharacters(`Ошибка!\n\n*Данные теги:* \n\n\`${ tags.join(", ") }\` \n\n*не существуют.*\n\nПожалуйста, попробуйте снова. Вот, кстати, весь список доступных тегов: [Ссылка](https://e621.net/tags)`),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: new InlineKeyboard()
            .text("Create anyway")
            .text("Retry", "subscriberCreate")
            .row()
            .text("Go to main menu", "openStartMenu")
        },
      }
    };
  };

  initialize(bot: Bot) {
    // Listening for chat message
    bot.on("message", async (ctx) => {
      const chat_id = ctx.update.message?.chat?.id;
      if (!chat_id) return;

      const action = (await this.gateway.getCurrentChannelAction(String(chat_id)));
      if (action && action.type === EChannelActionType.CREATE_SUBSCRIBER) {
        const tags = ctx.update.message.text.split(" ");
        const wrongTags = [];

        // Checking tags
        for await (const tagId of tags) {
          let tag = await this.gateway.api.fetchTag(tagId);

          if (!tag || tag.length < 1) {
            wrongTags.push(tagId);
          };
        };

        // Showing TagsError message
        if (wrongTags.length > 0) {
          ctx.api.deleteMessage(chat_id, action.data.messageId);
          // Opening successMenu
          const message = this._messageBuilder("TagsError", wrongTags);
          if (action.data.messageId) {
            ctx.reply(message.text, message.options);
          };
        } else {
          // Creating new subscriber
          await this.gateway.addSubscriber({
            type: EConsumerType.TELEGRAM,
            chatId: String(chat_id),
          }, tags);

          // Deleting current channel action
          await this.gateway.deleteCurrentChannelAction(String(chat_id));

          ctx.api.deleteMessage(chat_id, action.data.messageId);
          // Opening successMenu
          const message = this._messageBuilder("Subscribed", tags);
          if (action.data.messageId) {
            ctx.reply(message.text, message.options);
          };
        };
      };
    });
  }
}
