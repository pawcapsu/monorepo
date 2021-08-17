import { ObjectType, Field } from "@nestjs/graphql";
import { Profile, Book } from 'src/types/models';

import { UserRatingDirection } from "@pawcapsu/shared/src";
import { RelationalProp, IBookRating } from "@pawcapsu/shared/src";
import * as mongoose from "mongoose";

@ObjectType()
export class BookRating implements IBookRating {
  @Field(type => String, { nullable: false })
  _id: mongoose.Schema.Types.ObjectId;

  @Field(type => Profile, { description: 'User who left this Rating' })
  user: RelationalProp<Profile>;

  @Field(type => Book, { description: 'Entity (Book) which is rated.' })
  book: RelationalProp<Book>;

  @Field(type => String)
  direction: String;

  @Field(type => Date, { nullable: true })
  posted: Date;
};