import { Resolver, Args, Query, ResolveField, Parent } from "@nestjs/graphql";
import { Book, Profile } from 'src/types/models';
import { BooksService } from 'src/modules/books/services';
import { ProfilesService } from 'src/modules/profiles/services';
import * as mongoose from 'mongoose';

@Resolver(of => Book)
export class BooksResolver {
  constructor(
    private readonly service: BooksService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Query(returns => Book)
  async book(
    @Args('bookId', { description: 'Book _id' }) id: string,
  ) {
    return this.service.fetchBook(id);
  }

  @ResolveField('creator', returns => Profile)
  async getBookCreator(@Parent() book: Book) {
    return this.profilesService.findProfile(book.creator);
  };
}