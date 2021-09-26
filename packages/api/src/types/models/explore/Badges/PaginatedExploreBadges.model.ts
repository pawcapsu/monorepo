import { Field, ObjectType } from "@nestjs/graphql";
import { IPaginatedExploreBadges } from "@app/shared";
import { ExploreBadge } from "./ExploreBadge.model";

@ObjectType()
export class PaginatedExploreBadges implements IPaginatedExploreBadges {
  @Field(returns => [ExploreBadge], { nullable: false })
  docs: ExploreBadge[];

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
  [customLabel: string]: ExploreBadge[] | number | boolean | null | undefined;
};