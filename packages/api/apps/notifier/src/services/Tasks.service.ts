import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { EQueueNames } from 'apps/notifier/src/types';
import { IE621ScrapperData, IScrapperAgent, EMessageActionType } from '@app/services';
import { AgentsService } from '.';
import { Queue } from 'bull';

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
      const jobId = `scrape-${doc.consumer.chatId}`;

      const job = await this.scrapperQueue.getJob(jobId)
      if (!job || job && job.isCompleted) {
        await this.scrapperQueue.add(<IScrapperAgent<IE621ScrapperData>>doc, { 
          removeOnComplete: true, 
          removeOnFail: true,
          jobId,
        })
        .then(() => {
          this.agentsService.handleQueue(jobId, EMessageActionType.NEW_POST);
        });
      };
    };
  };
};