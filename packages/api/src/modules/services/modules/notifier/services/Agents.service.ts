import { IE621ScrapperData, IScrapperAgent } from "@app/services/notifier"
import { Post } from "@app/services/notifier/imported";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "bull";
import { EScrapperAgentType } from "libs/services/src";
import { Model, QueryCursor } from "mongoose";
import { ObjectId } from "src/types";
import { ScrapperAgentDocument } from "src/types/models";

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel('agent')
    private readonly agentModel: Model<ScrapperAgentDocument>,
  ) {}

  // createAgent
  // public async createAgent() {
  //   const agent = new this.agentModel({
  //     type: EScrapperAgentType.E621,
  //     consumer: 535019316,
  //     data: {
  //       tags: ['male/male', 'dalmatian', 'cute']
  //     }
  //   });

  //   return await agent.save();
  // };

  // notify
  public async notify<T>(
    agent: IScrapperAgent<T>,
    post: Post,
  ): Promise<void> {
    console.log("Notify in chat");
  };

  // handleQueue
  public async handleQueue(queue: Job) {
    // Waiting for task to finish
    queue.finished()
    .then(async (results) => {
      if (results != null) {
        const result: { agent: IScrapperAgent<IE621ScrapperData>, post: Post } = results;

        // Notifing user
        await this.notify(
          result.agent,
          result.post,
        );

        // Updating agent
        await this.updateLatestPostId(
          result.agent._id,
          String(result.post.id)
        );
      };
    });    
  };

  // updateLatestPostId
  public async updateLatestPostId(
    id: ObjectId,
    lastPostId: String,
  ): Promise<void> {
    const agent = await this.agentModel.findOne({ _id: id });

    if (agent) {
      agent.lastPostId = lastPostId;
      await this.agentModel.updateOne({ _id: id }, agent);
    };
  };

  // getCursor
  public getCursor(): QueryCursor<ScrapperAgentDocument> {
    return this.agentModel.find().cursor();
  };
};