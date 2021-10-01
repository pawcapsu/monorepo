import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IProfile } from "@app/shared";
import { ObjectId } from "@pawcapsu/types";

import { Book } from "../content";

export type ProfileDocument = Profile & Document;

@ObjectType()
export class Token {
  @Field()
  id: string;
}

@Schema()
@ObjectType()
export class Profile implements IProfile {
  @Field((type) => String, { nullable: false })
  _id: ObjectId;

  @Prop({ unique: true })
  @Field({ nullable: false })
  email: string;

  @Prop()
  @Field({ nullable: true })
  username: string;

  @Prop()
  @Field((type) => [Book])
  books: [Book];

  // interactions: UserInteractions;
  // ratings: [ProfileRating]
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
