import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { IChannelState } from "@app/services";
import { Document } from "mongoose";
import { ChannelAction } from '.';

export type ChannelStateDocument = Document & ChannelState;

@Schema()
export class ChannelState implements IChannelState {
  @Prop({ type: String, required: true })
  chat_id: number | string

  @Prop({ type: Object, required: false })
  action: ChannelAction;
};

export const ChannelStateSchema = SchemaFactory.createForClass(ChannelState);