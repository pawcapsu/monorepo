import { Resolver, Mutation, Parent, Args, Context } from "@nestjs/graphql";
import { Profile } from "@pawcapsu/types/models";
import { IRequest } from "@pawcapsu/auth/guards";
import { AuthService } from "@pawcapsu/modules/auth/services";

@Resolver((of) => Profile)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation((returns) => Profile)
  async login(@Args("token") token: string, @Context("req") req: IRequest) {
    const profile = await this.service.authorizeUser(token);

    if (profile != undefined) {
      req.session.uid = profile._id;
      return profile;
    }
  }
}
