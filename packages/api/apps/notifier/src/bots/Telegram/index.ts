import { BotCommand, BotEvent, BotInstance } from "libs/services/src";
import { Logger } from '@nestjs/common';
import { Bot } from 'grammy';

// Importing events and commands
import * as BotEvents from './events';
import * as BotCommands from './commands';

export class TelegramNotifierBot implements BotInstance {
  private bot: Bot;
  private readonly logger = new Logger(TelegramNotifierBot.name);

  constructor() {
    this.bot = new Bot("2038924887:AAHsd5yZUjNizuFDve2oSzPGz8SWOVMmu-c");

    // Initializing bot commands
    [...Object.values(BotCommands)].forEach((command) => {
      this.logger.log(`Initialize ${command.name} BotCommand`);
      const instance: BotCommand = new command();
      instance.initialize(this.bot);
    });

    // Initializing all bot events and commands
    [...Object.values(BotEvents)].forEach((event) => {
      this.logger.log(`Initialize ${event.name} BotEvent`);
      const instance: BotEvent = new event();
      instance.initialize(this.bot);
    });
  };

  // start action
  start(): Bot {
    this.bot.start();
    return this.bot;
  };
};