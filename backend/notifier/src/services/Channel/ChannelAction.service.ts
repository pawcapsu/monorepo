import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChannelAction, ChannelStateDocument } from "@notifier/types";
import { Model } from "mongoose";

@Injectable()
export class ChannelActionService {
  constructor(
    @InjectModel("channelState")
    private readonly channelModel: Model<ChannelStateDocument>,
  ) {}

  // public getCurrentAction
  public async getCurrentAction(chat_id: string): Promise<ChannelAction | null> {
    return (await this.channelModel.findOne({ chat_id }).exec()).action;
  };

  // public setCurrentAction
  public async setCurrentAction(chat_id: string, action: ChannelAction | null): Promise<ChannelAction> {
    const channel = await this.channelModel.findOne({ chat_id }).exec();

    if (channel) {
      // Updating
      channel.action = action;
      await this.channelModel.updateOne({ chat_id }, channel);
      return await this.getCurrentAction(chat_id);
    } else {
      // Creating
      return (await (new this.channelModel({ chat_id: String(chat_id), action })).save()).action;
    };
  };

  // public deleteCurrentAction
  public async deleteCurrentAction(chat_id: string): Promise<ChannelAction | null> {
    return await this.setCurrentAction(chat_id, null);
  };
};