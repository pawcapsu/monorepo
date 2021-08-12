import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UsersService } from '../services';
import { Profile } from '../../../types/models';

@Resolver(of => Profile)
export class ProfilesResolver{
  constructor(
    private service: UsersService
  ) {}

  @Mutation(returns => Profile)
  async createProfile(@Args('uid', { type: () => String }) uid: string) {
    return this.service.testAddProfile(uid);
  };

  @Query(returns => Profile)
  async profile(@Args('uid', { type: () => String }) uid: string) {
    return this.service.findProfile(uid);
  };
}