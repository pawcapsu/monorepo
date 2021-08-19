import { Resolver, ResolveField, Query, Parent, Args } from "@nestjs/graphql";
import { BookChapter, UniversalText } from 'src/types/models';
import { ChaptersService } from "src/modules/books/services";

@Resolver(of => BookChapter)
export class ChaptersResolver {
  constructor(
    private readonly service: ChaptersService,
  ) {}

  @Query(returns => BookChapter)
  async getChapter() {
    
  };

  // resolve content
  @ResolveField('content', returns => UniversalText)
  async resolveChapterContent(
    @Parent() chapter: BookChapter,
  ) {
    return await this.service.fetchContent(chapter._id)
  };
};