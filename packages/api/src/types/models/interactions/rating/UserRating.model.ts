import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserRating } from '@app/shared';
import { ObjectId } from 'src/types';
import { EUserRatingType, EUserRatingDirection } from '@app/shared';

export type UserRatingDocument = UserRating & Document;

@Schema()
export class UserRating implements IUserRating {
  _id: ObjectId;

  @Prop({ unique: false, type: String, required: true })
  user: ObjectId;
  
  @Prop({ type: String, required: true })
  entity: ObjectId;
  
  @Prop({ type: String, enum: Object.keys(EUserRatingType), required: true })
  type: EUserRatingType;

  @Prop({ type: String, enum: Object.keys(EUserRatingDirection), required: true })
  direction: EUserRatingDirection;

  @Prop({ type: Date, required: false })
  posted: Date;
}

export const UserRatingSchema = SchemaFactory.createForClass(UserRating);