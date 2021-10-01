import {
  EConsumerType,
  EMessageActionType,
  EScrapperAgentType,
  IE621ScrapperData,
  IScrapperAgent,
  UnifiedPost,
} from "@app/services";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryCursor } from "mongoose";
import { ObjectId } from "@pawcapsu/types";
import { ScrapperAgentDocument } from "apps/notifier/src/types";
import { TelegramGatewayService } from "@notifier/bots/Telegram/services";
import { InjectQueue } from "@nestjs/bull";
import { EQueueNames } from "apps/notifier/src/types";
import { Queue } from "bull";

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel("agent")
    private readonly agentModel: Model<ScrapperAgentDocument>,

    @InjectQueue(EQueueNames.E621)
    private scrapperQueue: Queue,

    private readonly telegramGateway: TelegramGatewayService
  ) {}

  private readonly logger = new Logger(SubscribersService.name);

  // createAgent
  public async createAgent() {
    const agent = new this.agentModel({
      type: EScrapperAgentType.E621,
      consumer: 535019316,
      data: {
        tags: ["male/male", "dalmatian", "cute"],
      },
    });

    return await agent.save();
  }

  // handleQueue
  public async handleQueue(jobId: string, _actionType?: EMessageActionType) {
    const job = await this.scrapperQueue.getJob(jobId);

    if (job) {
      job.finished().then(async (results) => {
        if (results != null) {
          // +todo Check agent type and dynamically
          // set Data
          type Data = IE621ScrapperData;
          const result: { agent: IScrapperAgent<Data>; post: UnifiedPost } =
            results;

          if (_actionType != null) result.post._actionType = _actionType;

          // Updating agent
          await this.updateLatestPostId(
            result.agent._id,
            String(result.post.id)
          );

          // Notifing user
          // Telegram Consumer
          if (result.agent.consumer.type === EConsumerType.TELEGRAM) {
            await this.telegramGateway.handlePost(result.agent, result.post);
          } else if (result.agent.consumer.type === EConsumerType.DISCORD) {
            console.log("DISCORD CONSUMER");
          }
        }
      });
    }
  }

  // updateLatestPostId
  public async updateLatestPostId(
    id: ObjectId,
    lastPostId: String
  ): Promise<void> {
    const agent = await this.agentModel.findOne({ _id: id });

    if (agent) {
      agent.lastPostId = lastPostId;
      await this.agentModel.updateOne({ _id: id }, agent);
    }
  }

  // getCursor
  public getCursor(): QueryCursor<ScrapperAgentDocument> {
    return this.agentModel.find().cursor();
  }
}
