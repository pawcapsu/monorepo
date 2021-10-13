import { BotCallbackQuery, EChannelActionType } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { SubscriberCommand, SubscriberCreateCommand } from "@notifier/bots/Telegram/commands";

export class SubscriberCreateCallback implements BotCallbackQuery {
  public includes = "subscriberCreate";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    const command = new SubscriberCreateCommand(this.gateway);
    const message = command._messageBuilder("CreateNew");

    // Setting current channel action
    const chat_id = ctx.update.callback_query?.message?.chat?.id;
    if (!chat_id) return;

    await this.gateway.setCurrentChannelAction(String(chat_id), {
      type: EChannelActionType.CREATE_SUBSCRIBER,
      data: {
        messageId: ctx.update.callback_query?.message?.message_id
      }
    });

    // Editing message
    ctx.editMessageText(message.text, message.options);
  };
};