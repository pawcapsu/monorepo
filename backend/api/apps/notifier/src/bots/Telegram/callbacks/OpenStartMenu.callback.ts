import { BotCallbackQuery } from "@app/services";
import { Context } from "grammy";
import { StartCommand } from "../commands";
import { TelegramGatewayService } from "../services";

export class OpenStartMenuCallback implements BotCallbackQuery {
  public includes = "openStartMenu";
  private gateway: TelegramGatewayService;

  constructor(gateway: TelegramGatewayService) {
    this.gateway = gateway;
  };

  public async run(ctx: Context) {
    const startCommand = new StartCommand(this.gateway);
    const message = await startCommand._messageBuilder(ctx.update?.callback_query?.message?.chat?.id);
    if (ctx.update.callback_query?.message?.document?.file_id != null) {
      ctx.deleteMessage();
      ctx.reply(message.text, message.options);   
    } else {
      ctx.editMessageText(message.text, message.options);
    }
  };
};