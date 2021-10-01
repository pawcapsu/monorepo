import { Field, ObjectType } from "@nestjs/graphql";
import { IPaginatedBooks } from "@app/shared";
import { Book } from "./Book.model";

@ObjectType()
export class PaginatedBooks implements IPaginatedBooks {
  @Field((returns) => [Book], { nullable: false })
  docs: Book[];

  @Field({ nullable: false })
  totalDocs: number;

  @Field({ nullable: false })
  limit: number;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: false })
  totalPages: number;

  @Field({ nullable: true })
  nextPage?: number;

  @Field({ nullable: true })
  prevPage?: number;

  @Field({ nullable: false })
  pagingCounter: number;

  @Field({ nullable: false })
  hasPrevPage: boolean;

  @Field({ nullable: false })
  hasNextPage: boolean;

  // Unknown fields
  meta?: any;
  [customLabel: string]: Book[] | number | boolean | null | undefined;
}
