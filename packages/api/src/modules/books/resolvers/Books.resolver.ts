import { Resolver, Args, Query, ResolveField, Parent } from "@nestjs/graphql";
import { Book, BookChapter, BookRating, BookTag, Profile, UniversalText } from 'src/types/models';
import { EUserRatingType, EUserRatingDirection, ETagType } from "@app/shared";
import { BooksService } from 'src/modules/books/services';
import { ChaptersService } from "src/modules/chapters/services";
import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from "src/modules/interactions/rating/services";
import { BookSearchOptionsInput } from "src/types/dto/content/Book/SearchOptions.dto";
import { PaginatedBooks } from "src/types/models/content/Book/PaginatedBooks.model";
import { TagService } from "src/modules/interactions/tag/services";
import { TagFilterOptionsInput } from "src/types/dto/interactions";

@Resolver(of => Book)
export class BooksResolver {
  constructor(
    private readonly service: BooksService,
    private readonly profilesService: ProfilesService,
    private readonly ratingService: RatingService,
    private readonly chaptersService: ChaptersService,
    private readonly tagsService: TagService,
  ) {}

  @Query(returns => Book)
  async book(
    @Args('bookId', { description: 'Book _id' }) id: string,
  ) {
    return this.service.fetchBook(id);
  }

  @Query(returns => PaginatedBooks)
  async books(
    @Args('page', { description: 'Paginated page', defaultValue: 1, nullable: true }) page: number,
    @Args('options', { nullable: true }) options: BookSearchOptionsInput
  ) {
    return this.service.fetchBooks(page, options);
  };

  // resolve description
  @ResolveField('description', returns => UniversalText)
  async resolveDescription(@Parent() book: Book) {
    return this.service.fetchDescription(book);
  };

  // resolve creator
  @ResolveField('creator', returns => Profile)
  async resolveBookCreator(@Parent() book: Book) {
    return this.profilesService.findProfile(book.creator);
  };

  // resolve likes
  @ResolveField('likes', returns => Number)
  async resolveBookLikes(@Parent() book: Book) {
    return this.ratingService.fetchLikes(book._id, EUserRatingType.BOOK);
  };

  // resolve dislikes
  @ResolveField('dislikes', returns => Number)
  async resolveBookDislikes(@Parent() book: Book) {
    return this.ratingService.fetchDislikes(book._id, EUserRatingType.BOOK);
  };

  // resolve ratings
  @ResolveField('ratings', returns => [BookRating])
  async resolveBookRatings(
    @Parent() book: Book,

    @Args('limit', { nullable: true, description: 'Number of ratings we need to get' }) limit?: number,
    @Args('direction', { nullable: true, description: 'Is it a Like or a Dislike?', type: () => EUserRatingDirection }) direction?: EUserRatingDirection,
  ) {
    return this.ratingService.fetchRatings(book._id, EUserRatingType.BOOK, { limit, direction });
  };

  // resolve chapters
  @ResolveField('chapters', returns => [BookChapter])
  async resolveBookChapters(
    @Parent() book: Book,

    @Args('limit', { nullable: true, description: 'Number of chapters we need to get' }) limit: number
  ) {
    const positions = await this.chaptersService.fetchPositions(book._id);
    const chapters = this.chaptersService._positionChapters(await this.chaptersService.fetchBookChapters(book._id, { limit }), positions);
    return chapters;
  };

  // resolve chaptersPositions
  @ResolveField('chaptersPositions', returns => [String])
  async resolveChaptersPositions(
    @Parent() book: Book,
  ) {
    return await this.chaptersService.fetchPositions(book._id);
  };

  // resolve bookSize
  @ResolveField('bookSize', returns => Number)
  async resolveBookSize(
    @Parent() book: Book,
  ) {
    return await this.chaptersService.calculateBookSize(book._id);
  };

  // resolve tags
  @ResolveField('tags', returns => [BookTag])
  async resolveBookTags(
    @Parent() book: Book,

    @Args('filters', { nullable: true }) filters?: TagFilterOptionsInput,
  ) {
    return await this.tagsService.fetchTags(book._id, ETagType.BOOK, filters);
  };
}