import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { UserPermissionsService } from 'src/modules/permissions/services';
import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from 'src/modules/interactions/rating/services';
import { UniversalTextService } from 'src/modules/text/services';
import { ChaptersService } from 'src/modules/chapters/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService, RatingService, UniversalTextService, ChaptersService, UserPermissionsService],
  exports: [...Object.values(services)],
})
export class BooksModule {};