import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBook, RelationalProp } from '@app/shared';
import * as mongoose from 'mongoose';

import { ObjectId } from 'src/types';

import { Profile } from '../../users';
import { BookRating } from '../../interactions';
import { BookChapter } from './Chapter.model';
import { UniversalText } from '../Text';

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
  @Field()
  title: string;

  @Prop()
  @Field()
  description: string;
  
  // Ratings
  @Field()
  likes: number;
  
  @Field()
  dislikes: number;

  @Prop()
  @Field(returns => [BookRating])
  ratings: BookRating[];

  @Prop()
  @Field(returns => [BookChapter])
  chapters: [BookChapter];
}

export const BookSchema = SchemaFactory.createForClass(Book);