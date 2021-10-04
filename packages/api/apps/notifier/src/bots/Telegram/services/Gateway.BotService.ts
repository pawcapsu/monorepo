import { Injectable, Logger } from "@nestjs/common";
import { InlineKeyboard } from "grammy";
import {
  EMessageActionType,
  EParseMode,
  EScrapperAgentType,
  IE621ScrapperData,
  IScrapperAgent,
  ISendPhotoOptions,
  UnifiedPost,
} from "@app/services";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Types } from "mongoose";
import { ChannelAction, ScrapperAgentDocument } from "@notifier/types";
import { TScrapperConsumer } from "@app/services";
import { ChannelActionService } from "@notifier/services";
import { ModuleRef } from "@nestjs/core";
import { BotsService } from "@notifier/bots/Bots.service";
import { _escapeCharacters } from "@notifier/helpers";
import { ApiService } from "@notifier/services/Sources/E621";

@Injectable()
export class TelegramGatewayService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly channelActionService: ChannelActionService,

    @InjectModel("agent")
    private readonly subscriberModel: Model<ScrapperAgentDocument>,
  ) {}
 
  public readonly api = new ApiService();
  private readonly logger = new Logger(TelegramGatewayService.name);

  // public fetchSubscribers
  public async fetchSubscribers(chat_id: number) {
    const subscribers = await this.subscriberModel.find({ "consumer.chatId": String(chat_id) }).exec();
    return subscribers;
  };

  // public addSubscriber
  public async addSubscriber(consumer: TScrapperConsumer, tags: String[]) {
    const subscriber = new this.subscriberModel({
      type: EScrapperAgentType.E621,
      consumer,
      data: {
        tags,
      },
    });

    return await subscriber.save();
  };

  // public deleteSubscriber
  public async deleteSubscriber(subscriberId: Types.ObjectId) {
    return await this.subscriberModel.deleteOne({ _id: subscriberId });
  };

  // getCurrentChannelAction
  public async getCurrentChannelAction(chat_id: string) {
    return await this.channelActionService.getCurrentAction(chat_id);
  };

  // setCurrentChannelAction
  public async setCurrentChannelAction(chat_id: string, action: ChannelAction) {
    return await this.channelActionService.setCurrentAction(chat_id, action);
  };

  // deleteCurrentChannelAction
  public async deleteCurrentChannelAction(chat_id: string) {
    return await this.channelActionService.deleteCurrentAction(chat_id);
  };

  // public removeSubscriber
  public async removeSubscriber(subscriber: ScrapperAgentDocument) {
    return await this.subscriberModel.remove({ _id: subscriber._id });
  };

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
    this._sendPhoto(Number(agent.consumer.chatId), post.url, caption);
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
        // Checking if it's first post or no
        if (agent.lastPostId == null) {
          return {
            caption: _escapeCharacters(`*First New Image!*\nА вот и первая ваша картинки по тегам, на которые вы недавно подписались!\n\nВы можете либо добавить эту картинку в Сохранёнки, нажав на \`⭐ Like it\`, либо же удалить её, нажав на \`🗑️ I don't like it\`\n\nСледующие сообщения будут намного компактнее!\n\n*Score*: ${
              post.score
            }\n*Watch tags*: \`${agent.data.tags.join(
              ", "
            )}\`\n*Source*: [link to e621](https://e621.net/posts/${post.id})\n`),
            parse_mode: EParseMode.MARKDOWNV2,
            reply_markup: new InlineKeyboard()
              .text("⭐ Like it", `favourite-${post.id}`)
              .text("🗑️ I don't like it", `delete-me`),
          };
        } else {
          // Else
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
        };

      default:
        break;
    }
  }

  // private _sendPhoto
  private _sendPhoto(to: number, photo_url: string, options?: ISendPhotoOptions) {
    const instance = this.moduleRef.get(BotsService);
    const bot = instance.getInstance();
    bot.api
      .sendPhoto(to, photo_url, {
        caption: options?.caption,
        parse_mode: options?.parse_mode,
        reply_markup: options?.reply_markup,
      })
      .catch((error) => {
        this.logger.error(
          `Error sending message to chatId ${to} in Telegram's LowLevelBotService`
        );
        this.logger.error(error);
      });
  };
}
