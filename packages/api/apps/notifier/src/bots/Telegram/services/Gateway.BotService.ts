import { Injectable } from "@nestjs/common";
import { InlineKeyboard } from "grammy";
import {
  EMessageActionType,
  EParseMode,
  IE621ScrapperData,
  IScrapperAgent,
  ISendPhotoOptions,
  UnifiedPost,
} from "@app/services";
import { LowLevelBotService } from ".";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ScrapperAgentDocument } from "@notifier/types";

@Injectable()
export class TelegramGatewayService {
  constructor(
    private readonly service: LowLevelBotService,

    @InjectModel("agent")
    private readonly subscriberModel: Model<ScrapperAgentDocument>,
  ) {}

  // public fetchSubscribers
  public async fetchSubscribers(chat_id: number) {
    const subscribers = await this.subscriberModel.find({ "consumer.chatId": String(chat_id) }).exec();
    return subscribers;
  };

  // public addSubscriber

  // public removeSubscriber

  // public editSubscriber

  // public handlePost
  public async handlePost(
    agent: IScrapperAgent<IE621ScrapperData>,
    post: UnifiedPost
  ) {
    // Generating message caption
    let caption = {};
    if (!post._actionType) {
      // +todo
      // Determine post action type?
      // or just assume that it's NEW_POST action
    } else {
      caption = this._generateCaption(agent, post, post._actionType);
    }

    // Sending message
    this.service.sendPhoto(agent.consumer.chatId, post.url, caption);
  }

  // private _generateCaption
  // +todo Change IE621ScrapperData type to dynamic Type
  // or remove it entirely (and check ScrapperData type by agent.type property)
  private _generateCaption(
    agent: IScrapperAgent<IE621ScrapperData>,
    post: UnifiedPost,
    type: EMessageActionType
  ): ISendPhotoOptions {
    switch (type) {
      // New Post Caption Generator
      case EMessageActionType.NEW_POST:
        return {
          caption: `*New image*\n\n*Score*: ${
            post.score
          }\n*Watch tags*: \`${agent.data.tags.join(
            ", "
          )}\`\n*Source*: [link to e621](https://e621.net/posts/${post.id})\n`,
          parse_mode: EParseMode.MARKDOWNV2,
          reply_markup: new InlineKeyboard()
            .text("⭐ Like it", `favourite-${post.id}`)
            .text("🗑️ I don't like it", `delete-me`),
        };

      default:
        break;
    }
  }
}
