import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { EScrapperAgentType, IScrapperAgent, TScrapperAgentData, TTelegramConsumer } from 'libs/services/src';
import { Document } from 'mongoose';
import { ObjectId } from 'src/types';

export type ScrapperAgentDocument = ScrapperAgent & Document;

@Schema()
export class ScrapperAgent implements IScrapperAgent<TScrapperAgentData> {
  _id: ObjectId;

  @Prop({ type: String, enum: Object.keys(EScrapperAgentType), required: true })
  type: EScrapperAgentType;

  @Prop({ type: Number, required: true })
  consumer: TTelegramConsumer

  @Prop({ type: Object, required: true })
  data: TScrapperAgentData;

  @Prop({ required: false })
  lastPostId: String;
};

export const ScrapperAgentSchema = SchemaFactory.createForClass(ScrapperAgent);