import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { EQueueNames } from '@notifier/types';
import { InjectQueue, OnGlobalQueueCompleted } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueBootstrapService implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(EQueueNames.E621)
    private scrapperQueue: Queue,
  ) {}

  private readonly logger = new Logger(QueueBootstrapService.name);

  async onApplicationBootstrap() {
    this.scrapperQueue.pause();
    this.logger.warn("Clearning ScrapperQueue...");
    await this.scrapperQueue.removeJobs("*scrape*");
    this.scrapperQueue.resume();
  };
}