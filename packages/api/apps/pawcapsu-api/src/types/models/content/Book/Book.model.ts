import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBook, RelationalProp } from '@app/shared';
import * as mongoose from 'mongoose';

import { ObjectId } from '@pawcapsu/types';

import { Profile } from '../../users';
import { BookRating } from '../../interactions';
import { BookChapter } from './Chapter/Chapter.model';
import { UniversalText } from '../Text';
import { BookTag } from '../../interactions';

export type BookDocument = Book & Document;

@Schema()
@ObjectType()
export class Book implements IBook {
  @Field(type => String)
  _id: ObjectId;

  @Prop({ unique: false, type: mongoose.Schema.Types.ObjectId })
  @Field(type => Profile)
  creator: ObjectId;

  // General information
  @Prop()
  @Field({ nullable: false })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  @Field(returns => UniversalText, { nullable: true })
  description: ObjectId;
  
  // Ratings
  @Field()
  likes: number;
  
  @Field()
  dislikes: number;

  @Prop()
  @Field(returns => [BookRating])
  ratings: BookRating[];

  @Prop()
  @Field(returns => [BookChapter], { nullable: false })
  chapters: BookChapter[];

  @Prop({ type: [String] })
  @Field(returns => [String], { nullable: false })
  chaptersPositions: ObjectId[];

  @Field({ nullable: false })
  bookSize: number;

  @Prop({ type: [String] })
  @Field(returns => [BookTag], { nullable: true })
  tags: ObjectId[]
}

export const BookSchema = SchemaFactory.createForClass(Book);