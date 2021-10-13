import { ObjectType, Field } from "@nestjs/graphql";
import { Book, Profile, UniversalText } from "@pawcapsu/types/models";
import { RelationalProp, IBookTag } from "@app/shared";
import { ObjectId } from "@pawcapsu/types";

@ObjectType()
export class BookTag implements IBookTag {
  @Field((type) => String, { nullable: false })
  _id: ObjectId;

  @Field((type) => Book, {
    description: "Entity (Book) which this tag belongs to.",
  })
  book: RelationalProp<Book>;

  @Field((type) => String, { nullable: true })
  icon?: string;

  @Field((type) => String, { nullable: true })
  title: string;

  @Field((type) => UniversalText, { nullable: true })
  description?: RelationalProp<UniversalText>;

  @Field({ nullable: false, defaultValue: () => "bg-indigo-500" })
  color?: string;

  @Field((type) => Profile, { nullable: true })
  creator?: RelationalProp<Profile>;
}
