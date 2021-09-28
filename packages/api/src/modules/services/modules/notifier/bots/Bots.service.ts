import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { BotInstance } from "libs/services/src";
import * as Bots from './index';

@Injectable()
export class BotsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BotsService.name);

  onApplicationBootstrap() {
    [...Object.values(Bots)].forEach((bot) => {
      try {
        const instance: BotInstance = new bot();
        instance.start();
        this.logger.log(`Started ${bot.name} BotInstance`);
      } catch(error) {
        this.logger.error(`Failed to start ${bot.name} BotInstance`, error);
      }
    });
  };
};