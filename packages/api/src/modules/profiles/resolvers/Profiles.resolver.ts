import { Resolver, Query, Args, Mutation, ResolveField, Parent } from "@nestjs/graphql";
import { ProfilesService } from 'src/modules/profiles/services';
import { BooksService } from "src/modules/books/services";
import { Profile, Book } from 'src/types/models';

@Resolver(of => Profile)
export class ProfilesResolver{
  constructor(
    private service: ProfilesService,
    private booksService: BooksService,
  ) {}

  // @Mutation(returns => Profile)
  // async createProfile(@Args('uid', { type: () => String }) uid: string): Promise<Profile> {
  //   return this.service.testAddProfile(uid);
  // };

  // @Mutation(returns => Book)
  // async createBook(
  //   @Args('uid') uid: string,
  //   @Args('title') title: string,
  //   @Args('description') description: string,
  // ) {
  //   return this.booksService.testAddBook(uid, title, description);
  // };

  @Query(returns => Profile)
  async profile(@Args('uid', { type: () => String }) uid: string) {
    return this.service.findProfile(uid);
  };

  @ResolveField('books', returns => Book)
  async books(@Parent() profile: Profile) {
    return this.booksService.fetchProfileBooks(profile._id);
  };
}