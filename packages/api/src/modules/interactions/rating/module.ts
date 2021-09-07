import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';
import { Services } from 'src/startup/services';

import * as resolvers from 'src/modules/interactions/rating/resolvers'
import * as services from 'src/modules/interactions/rating/services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(Services), ...Object.values(resolvers)],
})
export class RatingModule {};