import { ExploreBadgesSearchOptions } from "@app/shared/dtos";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ExploreBadgesSearchOptionsInput implements ExploreBadgesSearchOptions {
  @Field({ nullable: false, })
  limit: number;
};