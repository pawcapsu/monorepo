import { BotCommand, EParseMode } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { TelegramGatewayService } from "../../services";
import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { ScrapperAgentDocument } from "@notifier/types";

export class SubscribersKeyboard implements BotCommand {
  private gateway?: TelegramGatewayService;

  constructor(gateway?: TelegramGatewayService) {
    this.gateway = gateway;
  };

  // public _messageBuilder
  public _messageBuilder(subscriber: ScrapperAgentDocument, options?: {
    previousSubscriber: string,
    nextSubscriber: string,

    currentSubscriber: number,
    subscribersLength: number,
  }) {
    const keyboard = new InlineKeyboard()

    // Edit/Delete/Stop Subscriber
    if (subscriber) {
      keyboard
        .text("🗑️ Delete", `deleteSubscribe-${ subscriber._id }`)
        .text("✏️ Edit", `editSubscriber-${ subscriber._id }`)
        .text("🏠 Go back", "openSubscriberMenu")
        .row()
    } else {
      keyboard.text("🏠 Go back", "openSubscriberMenu");
    };

    // Checking for previos subscriber
    if (options.previousSubscriber) {
      keyboard.text("Previous", `previousSubsciberInfo-${ options.previousSubscriber }`)
    };

    // Checking for next subscriber
    if (options.nextSubscriber) {
      keyboard.text("Next", `nextSubsciberInfo-${ options.nextSubscriber }`);
    } else {
      keyboard.text("➕ Create new Subscriber", "subscriberCreate")
    };

    if (subscriber) {
      return {
        text: _escapeCharacters(`*Информация о подписке №${ options.currentSubscriber } из ${ options.subscribersLength } подписок*\n\n*ID Подписки*: \`${ subscriber._id }\`\n_Ид подписки в системе_\n\n*Теги*: \`${ subscriber.data.tags.join(", ") }\`\n_Теги, по которым мы ищем новые картинки_\n\n*Последнее обновление:*\n_Дата самого нового поста_\n\n\n`),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: keyboard,
        },
      }
    } else {
      return {
        text: _escapeCharacters(`*0 Подписок*\n\nДанный канал не подписан ни на один тег! Время это исправить, не думаешь?\n\nДля того, что бы подписаться на теги, нажмите на кнопку \`➕ Create new Subscriber\`, я вам там всё расскажу и объясню!`),
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: keyboard,
        },
      }
    };
  };

  public _determineOptions(subscribers: ScrapperAgentDocument[], current: ScrapperAgentDocument) {
    const previousSubsciber = subscribers.filter((x, index) => index == subscribers.indexOf(current) - 1);
    const nextSubsciber = subscribers.filter((x, index) => index == subscribers.indexOf(current) + 1);

    return {
      previousSubscriber: previousSubsciber[0] != null ? String(previousSubsciber[0]._id) : null,
      nextSubscriber: nextSubsciber[0] != null ? String(nextSubsciber[0]._id) : null,

      currentSubscriber: subscribers.indexOf(current) + 1,
      subscribersLength: subscribers.length,
    };
  };

  initialize(bot: Bot) {};
}
