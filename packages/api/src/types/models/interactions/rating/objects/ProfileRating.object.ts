import { ObjectType, Field } from "@nestjs/graphql";
import { Profile } from 'src/types/models';

import { UserRatingDirection } from "@pawcapsu/shared/src";
import { RelationalProp } from "@pawcapsu/shared/src";

@ObjectType()
export class ProfileRating {
  @Field(type => Profile, { description: 'User who left this Rating' })
  user: RelationalProp<Profile>;

  // @Field(type => Profile, { description: 'Entity (User) which is rated.' })
  // entity: RelationalProp<Profile>;

  // @Field(type => UserRatingDirection)
  // direction: UserRatingDirection;

  @Field(type => Date, { nullable: true })
  posted: Date;
};