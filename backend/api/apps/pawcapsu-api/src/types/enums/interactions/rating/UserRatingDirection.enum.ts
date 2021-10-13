import { registerEnumType } from "@nestjs/graphql";
import { EUserRatingDirection } from "@app/shared";

registerEnumType(EUserRatingDirection, {
  name: "EUserRatingDirection",
  description: "Is it an Like or an Dislike?",
});
