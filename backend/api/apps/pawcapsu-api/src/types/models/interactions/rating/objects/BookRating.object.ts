import { ObjectType, Field } from "@nestjs/graphql";
import { Profile, Book } from "@pawcapsu/types/models";
import { RelationalProp, IBookRating, EUserRatingDirection } from "@app/shared";
import { ObjectId } from "@pawcapsu/types";

@ObjectType()
export class BookRating implements IBookRating {
  @Field((type) => String, { nullable: false })
  _id: ObjectId;

  @Field((type) => Profile, { description: "User who left this Rating" })
  user: RelationalProp<Profile>;

  @Field((type) => Book, { description: "Entity (Book) which is rated." })
  book: RelationalProp<Book>;

  @Field((type) => EUserRatingDirection)
  direction: EUserRatingDirection;

  @Field((type) => Date, { nullable: true })
  posted: Date;
}
