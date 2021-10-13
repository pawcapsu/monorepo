import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { SubscribersKeyboard } from "@notifier/bots/Telegram/commands";

export class NextSubscriberCallback implements BotCallbackQuery {
  public includes = "nextSubsciberInfo";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    if (!ctx.update.callback_query?.message?.chat?.id) return;
    const command = new SubscribersKeyboard();
    const nextId = ctx.update.callback_query.data.replace("nextSubsciberInfo-", "");

    const subscribers = await this.gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id)
    const [subscriber] = subscribers.filter((x) => String(x._id) === String(nextId));
    
    if (subscriber) {
      const message = command._messageBuilder(subscriber, command._determineOptions(subscribers, subscriber));
      ctx.editMessageText(message.text, message.options);
    } else {
      console.log("not okay");
    };
  };
};