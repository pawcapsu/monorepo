import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProfile } from '../../../../../shared/src/index';

export type ProfileDocument = Profile & Document;

@Schema()
@ObjectType()
export class Profile implements IProfile {
  @Prop({ unique: true })
  @Field({ nullable: false })
  uid: string;

  @Prop({ unique: true })
  @Field({ nullable: false })
  username: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);