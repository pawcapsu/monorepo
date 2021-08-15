import { Resolver, Query, Args, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { ProfilesService } from 'src/modules/profiles/services';
import { BooksService } from 'src/modules/books/services';
import { Profile, Book } from 'src/types/models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, IRequest } from 'src/auth/guards';

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

  @ResolveField('books', returns => Book)
  async books(@Parent() profile: Profile) {
    return this.booksService.fetchProfileBooks(profile._id);
  };
}