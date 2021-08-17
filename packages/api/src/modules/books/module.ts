import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema, ProfileSchema, UserRatingSchema } from 'src/types/models';

import { ProfilesService } from 'src/modules/profiles/services';
import { RatingService } from 'src/modules/interactions/rating/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [MongooseModule.forFeature([
    { 
      name: 'book', 
      schema: BookSchema 
    },
    {
      name: 'profile',
      schema: ProfileSchema,
    },
    {
      name: 'userRating',
      schema: UserRatingSchema,
    },
  ])],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService, RatingService],
  exports: [...Object.values(services)],
})
export class BooksModule {};