import { Resolver, Args, Query, ResolveField, Parent } from "@nestjs/graphql";
import { Book, BookRating, Profile, UserRatingDirection, UserRatingType } from 'src/types/models';
import { BooksService } from 'src/modules/books/services';
import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from "src/modules/interactions/rating/services";

@Resolver(of => Book)
export class BooksResolver {
  constructor(
    private readonly service: BooksService,
    private readonly profilesService: ProfilesService,
    private readonly ratingService: RatingService,
  ) {}

  @Query(returns => Book)
  async book(
    @Args('bookId', { description: 'Book _id' }) id: string,
  ) {
    return this.service.fetchBook(id);
  }

  // resolve creator
  @ResolveField('creator', returns => Profile)
  async resolveBookCreator(@Parent() book: Book) {
    return this.profilesService.findProfile(book.creator);
  };

  // resolve likes
  @ResolveField('likes', returns => Number)
  async resolveBookLikes(@Parent() book: Book) {
    return this.ratingService.fetchLikes(book._id, UserRatingType.BOOK);
  };

  // resolve dislikes
  @ResolveField('dislikes', returns => Number)
  async resolveBookDislikes(@Parent() book: Book) {
    return this.ratingService.fetchDislikes(book._id, UserRatingType.BOOK);
  };

  // resolve ratings
  @ResolveField('ratings', returns => [BookRating])
  async resolveBookRatings(
    @Parent() book: Book,

    @Args('limit', { nullable: true, description: 'Number of ratings we need to get' }) limit?: number,
    @Args('direction', { nullable: true, description: 'Is it a Like or a Dislike?' }) direction?: UserRatingDirection,
  ) {
    return this.ratingService.fetchRatings(book._id, UserRatingType.BOOK, { limit, direction });
  };
}