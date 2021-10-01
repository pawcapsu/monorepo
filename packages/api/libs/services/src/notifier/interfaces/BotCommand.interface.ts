import { Bot } from "grammy";

export interface BotCommand {
  initialize: (bot: Bot) => void;
}
