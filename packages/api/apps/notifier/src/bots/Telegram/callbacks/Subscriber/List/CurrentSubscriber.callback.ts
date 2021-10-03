import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { SubscribersKeyboard } from "@notifier/bots/Telegram/commands";

export class CurrentSubscriberCallback implements BotCallbackQuery {
  public includes = "subscriberMenu-subscribersKeyboard";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    const command = new SubscribersKeyboard();

    if (ctx.update.callback_query?.message?.chat?.id == null) return; 
    // Getting first subscriber
    const subscribers = await this.gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id);
    const subscriber = subscribers[0] || null;

    const message = command._messageBuilder(subscriber, command._determineOptions(subscribers, subscriber));
    ctx.editMessageText(message.text, message.options)
  };
};