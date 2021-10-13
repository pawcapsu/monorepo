import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import {
  EScrapperAgentType,
  IScrapperAgent,
  TScrapperAgentData,
  TScrapperConsumer,
} from "@app/services";
import { ObjectId } from "@pawcapsu/types";
import { Document } from "mongoose";

export type ScrapperAgentDocument = ScrapperAgent & Document;

@Schema()
export class ScrapperAgent implements IScrapperAgent<TScrapperAgentData> {
  _id: ObjectId;

  @Prop({ type: String, enum: Object.keys(EScrapperAgentType), required: true })
  type: EScrapperAgentType;

  @Prop({ type: Object, required: true })
  consumer: TScrapperConsumer;

  @Prop({ type: Object, required: true })
  data: TScrapperAgentData;

  @Prop({ required: false })
  lastPostId?: String;
}

export const ScrapperAgentSchema = SchemaFactory.createForClass(ScrapperAgent);
