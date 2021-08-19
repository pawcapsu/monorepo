import { registerEnumType } from "@nestjs/graphql";
import { EUserRatingType } from "@app/shared";

registerEnumType(EUserRatingType, {
  name: 'EUserRatingType',
  description: 'Is it an Like or an Dislike?'
});