import { Bot } from 'grammy';

export interface BotEvent {
  initialize: (bot: Bot) => void
};