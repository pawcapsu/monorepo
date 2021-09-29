import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { EQueueNames } from 'apps/notifier/src/types';
import { IE621ScrapperData, IScrapperAgent } from '@app/services';
import { AgentsService } from '.';
import { Job, Queue } from 'bull';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue(EQueueNames.E621)
    private scrapperQueue: Queue,

    private readonly agentsService: AgentsService, 
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    for await (const doc of this.agentsService.getCursor()) {
      this.scrapperQueue.add(<IScrapperAgent<IE621ScrapperData>>doc)
      .then((queue: Job) => {
        this.agentsService.handleQueue(queue);
      });
    };
  };
};