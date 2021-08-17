import { Resolver, Query, ResolveField, Mutation, Parent, Args } from '@nestjs/graphql';
import { BookRating, Profile, Book, UserRatingType } from 'src/types/models';

import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from 'src/modules/interactions/rating/services';
import { BooksService } from 'src/modules/books/services';
import * as mongoose from 'mongoose';

@Resolver(type => BookRating)
export class BookRatingResolver {
  constructor(
    private readonly ratingService: RatingService,
    private readonly booksService: BooksService,
    private readonly profilesService: ProfilesService,
  ) {}

  // postBookRating mutation
  @Mutation(returns => BookRating)
  async postBookRating() {
    return await this.ratingService.postRating();
  };

  // getBookRating
  @Query(returns => BookRating)
  async getBookRating(
    @Args('ratingId', { description: 'UserRating _id property' }) ratingId: string,
  ) {
    return await this.ratingService.fetchRating(ratingId, UserRatingType.BOOK);
  };

  // getBookRating[s]
  @Query(returns => [BookRating])
  async getBookRatings(
    @Args('bookId', { description: 'Book _id property' }) bookId: string
  ) {
    return await this.ratingService.fetchRatings(bookId, UserRatingType.BOOK);
  };

  // resolveUserField
  @ResolveField('user', returns => Profile)
  async resolveUserField(
    @Parent() rating: BookRating,
  ) {
    return await this.profilesService.findProfile(rating.user as mongoose.Schema.Types.ObjectId);
  };

  // resolveEntityField
  @ResolveField('book', retuns => Book)
  async resolveEntityField(
    @Parent() rating: BookRating
  ) {
    return await this.booksService.fetchBook((<unknown>rating.book) as string);
  };
};