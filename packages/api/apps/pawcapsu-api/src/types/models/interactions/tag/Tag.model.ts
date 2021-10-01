import { ITag, ETagType } from "@app/shared";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

import { ObjectId } from "@pawcapsu/types";

import { Profile } from "@pawcapsu/types/models";

export type TagDocument = Tag & Document;

@Schema()
export class Tag implements ITag {
  _id: ObjectId;

  @Prop({ type: String, enum: Object.keys(ETagType), required: true })
  type: ETagType;

  @Prop({ type: String, required: false })
  icon?: string;

  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({
    unique: false,
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  })
  creator?: ObjectId;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
