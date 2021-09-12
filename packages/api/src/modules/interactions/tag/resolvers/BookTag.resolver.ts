import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ProfilesService } from 'src/modules/profiles/services';
import { BookTag, Profile } from 'src/types/models';
import { TagService } from '../services';
import * as mongoose from 'mongoose';

@Resolver(of => BookTag)
export class BookTagResolver {
  constructor(
    private readonly tagService: TagService,
    private readonly profilesService: ProfilesService,
  ) {}

  // getBookTag
  @Query(returns => BookTag)
  public async getBookTag() {

  };

  // getBookTag[s]
  @Query(returns => [BookTag])
  public async getBookTags() {

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
}