import { ObjectType, Field } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUniversalText, UNodeEntity } from '@app/shared';
// import { NodeEntityUnion } from 'src/types/unions';
import { TextNodeObject } from '.';

export type UniversalTextDocument = UniversalText & Document;

@Schema()
@ObjectType()
export class UniversalText implements IUniversalText {
  @Prop()
  @Field()
  version: number;
  
  @Field(type => [TextNodeObject], { nullable: true })
  @Prop({ required: true })
  nodes: [TextNodeObject];
};

export const UniversalTextSchema = SchemaFactory.createForClass(UniversalText);