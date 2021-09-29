import { ISendPhotoOptions } from '@app/services';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BotsService } from '../../Bots.service';

@Injectable()
export class TestBotService implements OnModuleInit {
  private service: BotsService;
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
    });
  };
};