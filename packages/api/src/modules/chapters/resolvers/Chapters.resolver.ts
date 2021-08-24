import { Resolver, ResolveField, Query, Parent, Args, Mutation, Context } from "@nestjs/graphql";
import { Book, BookChapter, Profile, UniversalText } from 'src/types/models';
import { ChaptersService } from "src/modules/chapters/services";
import { ChapterInformationInput } from "src/types/dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth";
import { ObjectId } from "mongoose";

@Resolver(of => BookChapter)
export class ChaptersResolver {
  constructor(
    private readonly service: ChaptersService,
  ) {}

  @Query(returns => BookChapter)
  async getChapter() {
    
  };

  // create chapter
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => BookChapter)
  async createChapter(
    @Args('bookId', { type: () => String }) bookId: ObjectId,
    @Args('information') information: ChapterInformationInput,
    @Context('user') user: Profile,
  ) {
    return await this.service.createChapter(user, bookId, information);
  };

  // update chapter

  // delete chapter
  @Mutation(returns => BookChapter)
  async deleteChapter(
    @Args('chapterId', { type: () => String }) chapterId: ObjectId,
    @Context('user') user: Profile
  ) {
    return await this.service.deleteChapter(user, chapterId);
  };

  // move chapter
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => [BookChapter])
  async moveChapter(
    @Args('bookId', { type: () => String }) bookId: ObjectId,
    @Args('fromChapter', { type: () => String }) fromChapterId: ObjectId,
    @Args('toChapter', { type: () => String }) toChapterId: ObjectId,
    @Context('user') user: Profile,
  ) {
    return await this.service.moveChapter(user, bookId, fromChapterId, toChapterId);
  };

  // resolve description
  @ResolveField('description', returns => UniversalText)
  async resolveDescription(
    @Parent() chapter: BookChapter,
  ) {
    return await this.service.fetchDescription(chapter);
  };

  // resolve content
  @ResolveField('content', returns => UniversalText)
  async resolveContent(
    @Parent() chapter: BookChapter,
  ) {
    return await this.service.fetchContent(chapter);
  };
};