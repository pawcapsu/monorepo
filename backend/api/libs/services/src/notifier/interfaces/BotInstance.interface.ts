import { Bot } from "grammy";

export interface BotInstance {
  start: () => Bot;
}
