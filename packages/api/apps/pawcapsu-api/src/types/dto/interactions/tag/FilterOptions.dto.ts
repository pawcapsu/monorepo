import { TagFilterOptions } from "@app/shared/dtos";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class TagFilterOptionsInput implements TagFilterOptions {
  @Field({ nullable: true })
  limit?: number;
}
