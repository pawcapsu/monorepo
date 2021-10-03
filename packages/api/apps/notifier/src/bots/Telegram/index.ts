import { BotCommand, BotEvent, BotInstance } from "libs/services/src";
import { Logger } from "@nestjs/common";
import { Bot, GrammyError, HttpError } from "grammy";

// Importing events and commands
import * as BotEvents from "./events";
import * as BotCommands from "./commands";
import { TelegramGatewayService } from "./services";
import { CallbackInitializer } from "./callbacks/CallbackInitializer";

export class TelegramNotifierBot implements BotInstance {
  private bot: Bot;
  private readonly gateway: TelegramGatewayService;
  private readonly logger = new Logger(TelegramNotifierBot.name);

  constructor(
    gateway: TelegramGatewayService
  ) {
    this.gateway = gateway;
    this.bot = new Bot("2038924887:AAHsd5yZUjNizuFDve2oSzPGz8SWOVMmu-c");

    CallbackInitializer(this.bot, this.gateway);

    // Initializing bot commands
    [...Object.values(BotCommands)].forEach((command) => {
      this.logger.log(`Initialize ${command.name} BotCommand`);
      const instance: BotCommand = new command(gateway);
      instance.initialize(this.bot);
    });

    // Initializing all bot events and commands
    [...Object.values(BotEvents)].forEach((event) => {
      this.logger.log(`Initialize ${event.name} BotEvent`);
      const instance: BotEvent = new event();
      instance.initialize(this.bot, gateway);
    });
  }

  // start action
  start(): Bot {
    this.bot.start().catch((err) => {
      const ctx = err.ctx;
      this.logger.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        this.logger.error("Error in request:", e.description);
      } else if (e instanceof HttpError) {
        this.logger.error("Could not contact Telegram:", e);
      } else {
        this.logger.error("Unknown error:", e);
      } 
    });
    return this.bot;
  }
}
