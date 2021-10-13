// Importing all callbacks
import { Logger } from "@nestjs/common";
import { Bot } from "grammy";
import * as Callbacks from ".";
import { TelegramGatewayService } from "../services";

// Exporting initializer function
export function CallbackInitializer(bot: Bot, gateway: TelegramGatewayService) {
  const logger = new Logger("CallbackInitializer");
  logger.warn("Initializing callbacks...");

  // Map of callbacks
  const callbacks = [];
  [...Object.values(Callbacks)].forEach((Callback) => {
    const instance = new Callback(gateway);
    logger.log(`Loaded ${Callback.name} BotCallbackQuery class`);
    callbacks.push(instance);
  });

  // Listening for callbacks
  bot.on("callback_query:data", (ctx) => {
    callbacks.forEach((callback) => {
      if (ctx.update.callback_query?.data.includes(callback.includes)) {
        callback.run(ctx);
      };
    });
  });
};