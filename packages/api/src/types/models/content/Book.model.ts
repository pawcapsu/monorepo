import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBook } from '@pawcapsu/shared/src';
import * as mongoose from 'mongoose';

import { Profile } from '../users';

export type BookDocument = Book & Document;

@Schema()
@ObjectType()
export class Book implements IBook {
  @Field(type => String)
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: false, type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  @Field(type => Profile)
  creator: mongoose.Schema.Types.ObjectId;

  @Prop()
  @Field()
  description: string;
  
  @Prop()
  @Field()
  title: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);