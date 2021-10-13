import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { Bot } from "grammy";

export interface BotEvent {
  initialize: (bot: Bot, gateway?: TelegramGatewayService) => void;
}
