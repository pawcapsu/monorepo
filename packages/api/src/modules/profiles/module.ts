import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema, BookSchema } from 'src/types/models';
import { BooksService } from 'src/modules/books/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [MongooseModule.forFeature([
    { 
      name: 'profile', 
      schema: ProfileSchema 
    },
    {
      name: 'book',
      schema: BookSchema,
    }])],
  providers: [...Object.values(resolvers), ...Object.values(services), BooksService],
  exports: [...Object.values(services)],
})
export class ProfilesModule {};