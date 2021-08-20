import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { UniversalTextService } from 'src/modules/text/services';
import { ProfilesService } from 'src/modules/profiles/services';
import { BooksService } from 'src/modules/books/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services), UniversalTextService, ProfilesService, BooksService],
  exports: [...Object.values(services)],
})
export class ChaptersModule {};