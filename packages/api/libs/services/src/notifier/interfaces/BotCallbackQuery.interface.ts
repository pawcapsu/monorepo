import { Context } from "grammy";

export interface BotCallbackQuery {
  includes: string,
  run: (context: Context) => void,
};