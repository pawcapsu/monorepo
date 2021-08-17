import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserRating } from '@pawcapsu/shared/src';
// import { UserRatingType } from '@pawcapsu/shared/src';
import * as mongoose from 'mongoose';

export enum UserRatingType {
  PROFILE = 'PROFILE',
  BOOK = 'BOOK',
};

export enum UserRatingDirection {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
};

export type UserRatingDocument = UserRating & Document;

@Schema()
export class UserRating implements IUserRating {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: false, type: String, required: true })
  user: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: String, required: true })
  entity: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: String, enum: Object.keys(UserRatingType), required: true })
  type: UserRatingType;

  @Prop({ type: String, enum: Object.keys(UserRatingDirection), required: true })
  direction: UserRatingDirection;

  @Prop({ type: Date, required: false })
  posted: Date;
}

export const UserRatingSchema = SchemaFactory.createForClass(UserRating);