import { ISendPhotoOptions } from '@app/services';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BotsService } from '../../Bots.service';

@Injectable()
export class LowLevelBotService implements OnModuleInit {
  private service: BotsService;
  private readonly logger = new Logger(LowLevelBotService.name);
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(BotsService);
  };

  public sendPhoto(
    to: number,
    photo_url: string,
    options?: ISendPhotoOptions,
  ) {
    const bot = this.service.getInstance();
    bot.api.sendPhoto(to, photo_url, {
      caption: options?.caption,
      parse_mode: options?.parse_mode,
      reply_markup: options?.reply_markup,
    })
    .catch((error) => {
      this.logger.error(`Error sending message to chatId ${to} in Telegram's LowLevelBotService`);
      this.logger.error(error);
    });
  };
};