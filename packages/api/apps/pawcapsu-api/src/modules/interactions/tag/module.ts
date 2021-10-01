import { Module } from "@nestjs/common";
import { ModelsImports } from "@pawcapsu/startup/models";
import { Services } from "@pawcapsu/startup/services";

import * as resolvers from "@pawcapsu/modules/interactions/tag/resolvers";
import * as services from "@pawcapsu/modules/interactions/tag/services";

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(Services)],
  exports: [...Object.values(services)],
})
export class TagModule {}
