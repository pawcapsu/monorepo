import { BotCommand, EParseMode } from "@app/services";
import { _escapeCharacters } from "@notifier/helpers";
import { TelegramGatewayService } from "../../services";
import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { ScrapperAgentDocument } from "@notifier/types";

export class SubscribersKeyboard implements BotCommand {
  initialize(bot: Bot, gateway: TelegramGatewayService) {
    // messageBuilder
    function _messageBuilder(subscriber: ScrapperAgentDocument, options?: {
      previousSubscriber: string,
      nextSubscriber: string,

      currentSubscriber: number,
      subscribersLength: number,
    }) {
      const keyboard = new InlineKeyboard()

      // Checking for previos subscriber
      if (options.previousSubscriber) {
        keyboard.text("Previous", `previousSubsciberInfo-${ options.previousSubscriber }`)
      };

      // Back button
      keyboard.text("Go back", "openSubscriberMenu");

      // Checking for next subscriber
      if (options.nextSubscriber) {
        keyboard.text("Next", `nextSubsciberInfo-${ options.nextSubscriber }`);
      } else {
        keyboard.text("Create new Subscriber", 'createNewSubscriber')
      };

      return {
        text: `*Информация о подписке №${ options.currentSubscriber } из ${ options.subscribersLength } подписок*\n\n*ID Подписки*: \`${ subscriber._id }\`\n_Ид подписки в системе_\n\n*Теги*: \`${ subscriber.data.tags.join(", ") }\`\n_Теги, по которым мы ищем новые картинки_\n\n*Последнее обновление:*\n_Дата самого нового поста_\n\n\n[Удалить подписку](https://google.com)\n[Редактировать подписку](https://google.com)`,
        options: {
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: keyboard,
        },
      }
    };
    
    // private _determineOptions
    function _determineOptions(subscribers: ScrapperAgentDocument[], current: ScrapperAgentDocument) {
      const previousSubsciber = subscribers.filter((x, index) => index == subscribers.indexOf(current) - 1);
      const nextSubsciber = subscribers.filter((x, index) => index == subscribers.indexOf(current) + 1);

      return {
        previousSubscriber: previousSubsciber[0] != null ? String(previousSubsciber[0]._id) : null,
        nextSubscriber: nextSubsciber[0] != null ? String(nextSubsciber[0]._id) : null,

        currentSubscriber: subscribers.indexOf(current) + 1,
        subscribersLength: subscribers.length,
      };
    };

    // SubscribersKeyboard CallbackQuery
    bot.callbackQuery("subscriberMenu-subscribersKeyboard", async (ctx) => {
      if (ctx.update.callback_query?.message?.chat?.id == null) return; 
      // Getting first subscriber
      const subscribers = await gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id);
      const subscriber = subscribers[0] || null;

      const message = _messageBuilder(subscriber, _determineOptions(subscribers, subscriber));
      ctx.editMessageText(message.text, message.options)
    });
    
    
    bot.on("callback_query:data", async (ctx) => {
      // NextSubscriber CallbackQuery
      if (ctx.update.callback_query?.data?.includes("nextSubsciberInfo")) {
        if (!ctx.update.callback_query?.message?.chat?.id) return;
        const nextId = ctx.update.callback_query.data.replace("nextSubsciberInfo-", "");

        const subscribers = await gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id)
        const [subscriber] = subscribers.filter((x) => String(x._id) === String(nextId));
        
        if (subscriber) {
          const message = _messageBuilder(subscriber, _determineOptions(subscribers, subscriber));
          ctx.editMessageText(message.text, message.options);
        } else {
          console.log("not okay");
        };
      // PreviosSubscriber CallbackQuery
      } else if (ctx.update.callback_query?.data?.includes("previousSubsciberInfo")) {
        if (!ctx.update.callback_query?.message?.chat?.id) return;
        const previousId = ctx.update.callback_query.data.replace("previousSubsciberInfo-", "");

        const subscribers = await gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id)
        const [subscriber] = subscribers.filter((x) => String(x._id) === String(previousId));
        
        if (subscriber) {
          const message = _messageBuilder(subscriber, _determineOptions(subscribers, subscriber));
          ctx.editMessageText(message.text, message.options);
        } else {
          console.log("not okay");
        };
      };
    });
  }
}
