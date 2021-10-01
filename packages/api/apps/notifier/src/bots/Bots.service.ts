import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { BotInstance } from "@app/services";
import { Bot } from "grammy";
import * as Bots from "./index";

@Injectable()
export class BotsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BotsService.name);
  private readonly instances: Array<Bot> = [];

  onApplicationBootstrap() {
    [...Object.values(Bots)].forEach(async (bot) => {
      try {
        this.logger.log(`Starting ${bot.name} BotInstance...`);
        const instance: BotInstance = new bot();
        this.instances.push(instance.start());
        this.logger.log(`Started ${bot.name} BotInstance`);
      } catch (error) {
        this.logger.error(`Failed to start ${bot.name} BotInstance`, error);
      }
    });
  }

  public getInstance(): Bot {
    return this.instances[0];
  }
}
