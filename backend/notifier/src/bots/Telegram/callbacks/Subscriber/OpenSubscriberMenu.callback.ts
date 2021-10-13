import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { SubscriberCommand } from "../../commands";
import { TelegramGatewayService } from "../../services";

export class OpenSubscriberMenuCallback implements BotCallbackQuery {
  private gateway: TelegramGatewayService;
  public includes = "openSubscriberMenu";

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };
  
  public async run(ctx: Context) {
    const subscriberCommand = new SubscriberCommand();
    
    const message = subscriberCommand._messageBuilder();
    ctx.editMessageText(message.text, message.options)
  };
};