import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksService } from 'src/modules/books/services';
import { ProfilesService } from 'src/modules/profiles/services';

import { UserRatingSchema, BookSchema, ProfileSchema } from 'src/types/models';

import * as resolvers from 'src/modules/interactions/rating/resolvers'
import * as services from 'src/modules/interactions/rating/services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'userRating',
        schema: UserRatingSchema,
      },
      {
        name: 'book',
        schema: BookSchema,
      },
      {
        name: 'profile',
        schema: ProfileSchema,
      },
    ])
  ],
  providers: [...Object.values(services), ...Object.values(resolvers), BooksService, ProfilesService],
})
export class RatingModule {};