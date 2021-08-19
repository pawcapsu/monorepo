import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { BooksService } from 'src/modules/books/services';
import { ProfilesService } from 'src/modules/profiles/services';

import * as resolvers from 'src/modules/interactions/rating/resolvers'
import * as services from 'src/modules/interactions/rating/services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(services), ...Object.values(resolvers), BooksService, ProfilesService],
})
export class RatingModule {};