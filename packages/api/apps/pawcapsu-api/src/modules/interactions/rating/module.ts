import { Module } from "@nestjs/common";
import { ModelsImports } from "@pawcapsu/startup/models";
import { Services } from "@pawcapsu/startup/services";

import * as resolvers from "@pawcapsu/modules/interactions/rating/resolvers";
import * as services from "@pawcapsu/modules/interactions/rating/services";

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(Services), ...Object.values(resolvers)],
})
export class RatingModule {}
