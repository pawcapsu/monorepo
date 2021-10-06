import { Module } from "@nestjs/common";
import { BotsService } from "./bots/Bots.service";
import { BullModule } from "@nestjs/bull";
import { ScheduleModule } from "@nestjs/schedule";
import { ChannelStateSchema, EQueueNames } from "apps/notifier/src/types";
import { ScrapperAgentSchema } from "apps/notifier/src/types";
import { MongooseModule } from "@nestjs/mongoose";
import { SubscribeProcessors } from "./services/Sources";
import { ConfigModule } from "@nestjs/config";

import * as Services from "./services";
import * as Controllers from "./controllers";

import { ApiService as E621ApiService } from "./services/Sources/E621";

import { TelegramGatewayService } from "./bots/Telegram/services";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      "mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/notifier?retryWrites=true&w=majority",
      {
        connectionName: "service/notifier",
      }
    ),
    MongooseModule.forFeature(
      [
        {
          name: "agent",
          schema: ScrapperAgentSchema,
        },
        {
          name: "channelState",
          schema: ChannelStateSchema,
        }
      ],
      "service/notifier"
    ),
    BullModule.forRoot({
      redis: {
        host: "redis-14306.c16.us-east-1-2.ec2.cloud.redislabs.com",
        port: 14306,
        password: "4nRAVFYOr6xZTnjHMyR978j7DSQYOzYp",
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    BullModule.registerQueue({
      name: EQueueNames.E621,
      processors: [new SubscribeProcessors[0]().initialize()],
    }),
    // BullModule.registerQueue(...Object.keys(EQueueNames).map((name) => {
    //   return <BullModuleOptions>{
    //     name,
    //     processors: [
    //       ...Object.values(SeparateProcessors)
    //       .map((processor) => new processor())
    //       .filter((processor) => processor.type == name)
    //       .map((processor) => processor.initialize())
    //     ],
    //   };
    // })),
  ],
  providers: [
    // BotServices
    ...Object.values(Services),

    // Bots
    BotsService,

    // Bot Gateways
    TelegramGatewayService,

    // ApiServices
    E621ApiService,
  ],
  controllers: [...Object.values(Controllers)],
})
export class NotifierModule {}
