import { Module } from '@nestjs/common';
import { BotsService } from './bots/Bots.service';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { EQueueNames } from 'src/types/enums';
import { ScrapperAgentSchema } from 'src/types/models';
import { MongooseModule } from '@nestjs/mongoose';
import * as Processors from './processors';
import { AgentsService } from './services';

import * as Services from './services';
// import * as Processors from './processors';
import * as Controllers from './controllers';

@Module({
  imports: [
    BotsService,
    MongooseModule.forFeature([
      {
        name: 'agent',
        schema: ScrapperAgentSchema,
      }
    ], 'service/notifier'),
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
  ],
  controllers: [
    ...Object.values(Controllers)
  ]
})
export class NotifierModule {};