import { Resolver, Query, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { ProfilesService } from '@pawcapsu/modules/profiles/services';
import { BooksService } from '@pawcapsu/modules/books/services';
import { Profile, Book } from '@pawcapsu/types/models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, IRequest } from '@pawcapsu/auth/guards';

@Resolver(of => Profile)
export class ProfilesResolver{
  constructor(
    private service: ProfilesService,
    private booksService: BooksService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => Profile)
  async me(@Context('user') user: Profile) {
    return user;
  };

  @Query(returns => Profile)
  async profile(@Args('uid', { type: () => String }) uid: string) {
    return this.service.findProfile(uid);
  };

  @ResolveField('books', returns => [Book])
  async books(
    @Parent() profile: Profile,
    
    @Args('limit', { nullable: true, description: 'Number of books we need to get' }) limit: number,
  ) {
    return this.booksService.fetchProfileBooks(profile._id, { limit });
  };
}