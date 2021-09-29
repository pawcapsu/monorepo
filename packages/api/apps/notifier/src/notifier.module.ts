import { Module } from '@nestjs/common';
import { BotsService } from './bots/Bots.service';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EQueueNames } from 'apps/notifier/src/types';
import { ScrapperAgentSchema } from 'apps/notifier/src/types';
import { MongooseModule } from '@nestjs/mongoose';

import * as Services from './services';
import * as Processors from './processors';
import * as Controllers from './controllers';

import { TestBotService } from './bots/Telegram/services';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/notifier?retryWrites=true&w=majority', {
      connectionName: 'service/notifier'
    }),
    MongooseModule.forFeature([
      {
        name: 'agent',
        schema: ScrapperAgentSchema,
      }
    ], 'service/notifier'),
    BullModule.forRoot({
      redis: {
        host: "redis-16613.c244.us-east-1-2.ec2.cloud.redislabs.com",
        port: 16613,
        password: "cD14ZkN8VIKgEUMUJrC2ciEfAGzFMCze"
      }
    }),
    BullModule.registerQueue(...Object.keys(EQueueNames).map((name) => {
      return <BullModuleOptions>{
        name,
        processors: [
          ...Object.values(Processors)
          .map((processor) => new processor())
          .filter((processor) => processor.type == name)
          .map((processor) => processor.initialize())
        ]
      };
    })),
  ],
  providers: [
    ...Object.values(Services),
    // ...Object.values(Processors),

    // BotServices
    BotsService,
    TestBotService,
  ],
  controllers: [
    ...Object.values(Controllers)
  ]
})
export class NotifierModule {};