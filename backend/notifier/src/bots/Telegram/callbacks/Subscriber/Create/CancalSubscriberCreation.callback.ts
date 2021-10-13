import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { SubscriberCommand } from "@notifier/bots/Telegram/commands";

export class CancelSubscriberCreationCallback implements BotCallbackQuery {
  public includes = "cancelSubscriberCreation";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    const command = new SubscriberCommand();
    const message = command._messageBuilder();

    // Deleting current channel action
    const chat_id = ctx.update.callback_query?.message?.chat?.id;
    if (!chat_id) return;

    await this.gateway.deleteCurrentChannelAction(String(chat_id));

    // Opening subscriber menu
    ctx.editMessageText(message.text, message.options);
  };
};