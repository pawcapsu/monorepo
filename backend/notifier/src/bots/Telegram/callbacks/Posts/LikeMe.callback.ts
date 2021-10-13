import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";

export class LikeMeCallback implements BotCallbackQuery {
  public includes = "likePost";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
  };
};