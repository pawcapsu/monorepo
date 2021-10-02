import { Schema, Prop } from "@nestjs/mongoose";
import { EChannelActionType, IChannelAction } from "@app/services";

@Schema()
export class ChannelAction implements IChannelAction {
  @Prop({ type: String, enum: Object.keys(EChannelActionType), required: true })
  type: EChannelActionType;
  
  @Prop({ type: Object, required: false })
  data?: any;
};