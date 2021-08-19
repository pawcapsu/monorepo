import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBook } from '@app/shared';

import { ObjectId } from 'src/types';

import { Profile } from '../users';
import { BookRating } from '../interactions';

export type BookDocument = Book & Document;

@Schema()
@ObjectType()
export class Book implements IBook {
  @Field(type => String)
  _id: ObjectId;

  @Prop({ unique: false, type: String })
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
}

export const BookSchema = SchemaFactory.createForClass(Book);