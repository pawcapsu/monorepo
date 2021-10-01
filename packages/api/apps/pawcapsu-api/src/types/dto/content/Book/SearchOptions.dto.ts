import { BookSearchOptions } from "@app/shared/dtos";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class BookSearchOptionsInput implements BookSearchOptions {
  @Field({ nullable: false })
  limit: number;
}
