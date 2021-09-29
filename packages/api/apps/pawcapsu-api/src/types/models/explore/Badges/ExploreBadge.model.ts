import { IExploreBadge } from '@app/shared';
import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectId } from '@pawcapsu/types';
import { UniversalText } from '../..';

export type ExploreBadgeDocument = ExploreBadge & Document;

@Schema()
@ObjectType()
export class ExploreBadge implements IExploreBadge {
  @Field(type => String, { nullable: false })
  _id: ObjectId;

  @Prop({ required: true })
  @Field({ nullable: false, })
  title: string;

  @Prop({ required: false, default: () => 'bg-blue-500' })
  @Field({ nullable: true, defaultValue: () => 'bg-blue-500' })
  color: string;
  
  @Prop({ type: Types.ObjectId, required: false })
  @Field(type => UniversalText, { nullable: false })
  description: ObjectId;
  
  @Prop({ type: Array, required: true })
  actions: Array<string>;
};

export const ExploreBadgeSchema = SchemaFactory.createForClass(ExploreBadge);