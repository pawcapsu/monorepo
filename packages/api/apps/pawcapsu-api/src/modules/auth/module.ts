import { Module } from "@nestjs/common";
import { ModelsImports } from "@pawcapsu/startup/models";
import { Services } from "@pawcapsu/startup/services";

import { ProfilesService } from "@pawcapsu/modules/profiles/services";

import * as resolvers from "@pawcapsu/modules/auth/resolvers";
import * as services from "@pawcapsu/modules/auth/services";

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(Services)],
})
export class AuthModule {}
