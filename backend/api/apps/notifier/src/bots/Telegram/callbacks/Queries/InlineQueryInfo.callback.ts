import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { InlineQueryInfoCommand } from "../../commands";

export class InlineQueryInfoCallback implements BotCallbackQuery {
  public includes = "openInlineSearchInfoMenu";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    const command = new InlineQueryInfoCommand();
    
    const message = command._messageBuilder();
    ctx.deleteMessage();
    ctx.replyWithVideo(message.url, message.options);
  };
};