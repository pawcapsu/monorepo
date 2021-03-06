import { Field, ObjectType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { IBookChapter } from "@app/shared";
import { UniversalText } from "@pawcapsu/types/models";
import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { ObjectId } from "@pawcapsu/types";

export type BookChapterDocument = Document & BookChapter;

@Schema()
@ObjectType()
export class BookChapter implements IBookChapter {
  @Field((type) => String)
  _id?: ObjectId;

  // General information
  @Field()
  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  bookId: ObjectId;

  @Field((type) => UniversalText, { nullable: true })
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  description?: ObjectId;

  // Chapter content
  @Field((returns) => UniversalText, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  content?: ObjectId;

  // +todo
  // Editors
  // Comments
  // Ratings
}

export const BookChapterSchema = SchemaFactory.createForClass(BookChapter);
