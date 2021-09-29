import { Resolver, Query, ResolveField, Parent, Args, Mutation, Context } from '@nestjs/graphql';
import { ProfilesService } from '@pawcapsu/modules/profiles/services';
import { Book, BookTag, Profile, UniversalText } from '@pawcapsu/types/models';
import { TagService } from '../services';
import * as mongoose from 'mongoose';
import { BookTagInformationInput, TagFilterOptionsInput } from '@pawcapsu/types/dto/interactions';
import { ETagType } from '@app/shared';
import { GqlAuthGuard } from '@pawcapsu/auth';
import { UseGuards } from '@nestjs/common';
import { UniversalTextService } from '@pawcapsu/modules/text/services';
import { BooksService } from '@pawcapsu/modules/books/services';

@Resolver(of => BookTag)
export class BookTagResolver {
  constructor(
    private readonly tagService: TagService,
    private readonly profilesService: ProfilesService,
    private readonly textService: UniversalTextService,
    private readonly bookService: BooksService,
  ) {}

  // createBookTag
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => BookTag)
  public async createBookTag(
    @Args('information') information: BookTagInformationInput,
    @Context('user') user: Profile,
  ) {
    return await this.tagService.createTag(user, ETagType.BOOK, information);
  };

  // assignBookTag
  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Book)
  public async assignBookTag(
    @Args('bookId') id: string,
    @Args('tagId') tagId: string,

    @Context('user') user: Profile,
  ) {
    return await this.tagService.assignTag(user, ETagType.BOOK, tagId, id);
  };

  // getBookTag
  @Query(returns => BookTag)
  public async getBookTag(
    @Args('id') id: string,
  ) {
    return this.tagService.fetchTag(id, ETagType.BOOK);
  };

  // getBookTag[s]
  @Query(returns => [BookTag])
  public async getBookTags(
    @Args('bookId') id: string,
    @Args('filters', { nullable: true }) filters: TagFilterOptionsInput,
  ) {
    return this.tagService.fetchTags(id, ETagType.BOOK, filters);
  };

  // resolve creator
  @ResolveField('creator', returns => Profile)
  public async resolveCreator(
    @Parent() tag: BookTag,
  ): Promise<Profile | undefined> {
    if (tag.creator) {
      return await this.profilesService.findProfile(tag.creator as mongoose.Schema.Types.ObjectId);
    } else {
      return undefined;
    };
  };

  // resolve descripton
  @ResolveField('description', returns => UniversalText)
  public async resolveTagDescription(
    @Parent() tag: BookTag,
  ): Promise<UniversalText | undefined> {
    if (tag.description) {
      return await this.textService.fetchText(tag.description as mongoose.Schema.Types.ObjectId);
    } else {
      return undefined;
    };
  };

  // resolve book
  @ResolveField('book', returns => Book)
  public async resolveTagBook(
    @Parent() tag: BookTag,
  ) {
    return await this.bookService.fetchBook(tag.book as mongoose.Schema.Types.ObjectId);
  };
}