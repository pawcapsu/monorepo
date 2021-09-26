import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ExploreBadge, PaginatedExploreBadges, UniversalText } from 'src/types/models';
import { ExploreBadgeService } from 'src/modules/explore/services';
import { UniversalTextService } from 'src/modules/text/services';
import { ObjectId } from 'mongoose';
import { ExploreBadgesSearchOptionsInput } from 'src/types/dto/explore/Badges';

@Resolver(of => ExploreBadge)
export class ExploreBadgeResolver {
  constructor(
    private readonly service: ExploreBadgeService,
    private readonly textService: UniversalTextService,
  ) {}

  // query one ExploreBadge
  @Query(returns => ExploreBadge)
  public async getExploreBadge(
    @Args('id', { type: () => String }) id: ObjectId,
  ): Promise<ExploreBadge | null> {
    return await this.service.fetchBadge(id);
  };

  // query many ExploreBadges
  @Query(returns => PaginatedExploreBadges)
  public async getExploreBadges(
    @Args('page', { nullable: true }) page?: number,
    @Args('options', { nullable: true }) options?: ExploreBadgesSearchOptionsInput,
  ): Promise<PaginatedExploreBadges> {
    return await this.service.fetchBadges(page, options);
  };
  
  // resolve description
  @ResolveField('description', returns => UniversalText)
  public async resolveDescription(
    @Parent() badge: ExploreBadge
  ): Promise<UniversalText> {
    return await this.service.fetchDescription(badge._id);
  };
};