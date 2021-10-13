import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { Types } from "mongoose";
import { CurrentSubscriberCallback } from ".";
import { SubscribersKeyboard } from "../../commands";

export class SubscriberDeleteCallback implements BotCallbackQuery {
  public includes = "deleteSubscribe";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    if (!ctx.update.callback_query?.message?.chat?.id) return;
    const subscriberId = ctx.update.callback_query.data.replace("deleteSubscribe-", "");
    if (subscriberId.split("").length < 16) return;

    const _id = Types.ObjectId(subscriberId);

    // Deleting this subscriber
    const subscribers = await this.gateway.fetchSubscribers(ctx.update.callback_query?.message?.chat?.id);
    await this.gateway.deleteSubscriber(_id);
    
    // Determining which menu we should open
    const subscriberIndex = subscribers.indexOf(subscribers.find((x) => String(x._id) == subscriberId));
    if (subscriberIndex > 1) {
      // Opening previousSubscriber
      const command = new SubscribersKeyboard(this.gateway);
      const previousId = subscribers[subscriberIndex - 1]._id;
      const [subscriber] = subscribers.filter((x) => String(x._id) === String(previousId));
    
      // Removing this (subscriber) elemnt from subscribers array
      subscribers.splice(subscriberIndex, 1);

      if (subscriber) {
        const message = command._messageBuilder(subscriber, command._determineOptions(subscribers, subscriber));
        ctx.editMessageText(message.text, message.options);
      } else {
        console.log("not okay");
      };
    } else {
      // Opening currentSubscriber
      const command = new CurrentSubscriberCallback(this.gateway);
      command.run(ctx);
    };
  };
};