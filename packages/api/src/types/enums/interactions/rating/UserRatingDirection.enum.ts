import { registerEnumType } from "@nestjs/graphql";
import { UserRatingDirection } from "@pawcapsu/shared/src";

export const UserRatingDirectionEnum = registerEnumType(UserRatingDirection, {
  name: 'UserRatingDirection',
  description: 'Is it an Like or an Dislike?'
});