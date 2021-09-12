import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';
import { Services } from 'src/startup/services';

import * as resolvers from 'src/modules/interactions/tag/resolvers';
import * as services from 'src/modules/interactions/tag/services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(Services)],
  exports: [...Object.values(services)],
})
export class TagModule {};