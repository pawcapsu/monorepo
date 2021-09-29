import { ObjectType, Field } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { IUniversalText, EUniversalTextType, UNodeEntity } from '@app/shared';
import { NodeEntityUnion } from '@pawcapsu/types/unions';

export type UniversalTextDocument = UniversalText & Document;

@Schema()
@ObjectType()
export class UniversalText implements IUniversalText {
  @Field(type => String, { nullable: true })
  _id?: ObjectId;

  @Field(type => EUniversalTextType, { nullable: false, defaultValue: EUniversalTextType.TEXT })
  type?: EUniversalTextType;

  @Prop()
  @Field({ nullable: true })
  version?: number;
  
  @Field(type => [NodeEntityUnion], { nullable: true })
  @Prop({ required: true })
  nodes?: Array<UNodeEntity>;
};

export const UniversalTextSchema = SchemaFactory.createForClass(UniversalText);