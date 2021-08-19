import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from 'src/modules/interactions/rating/services';
import { UniversalTextService } from 'src/modules/text/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService, RatingService, UniversalTextService],
  exports: [...Object.values(services)],
})
export class BooksModule {};