import * as models from 'src/types/models';
import { MongooseModule } from '@nestjs/mongoose';

export const ModelsImports = MongooseModule.forFeature([
  { 
    name: 'profile', 
    schema: models.ProfileSchema,
  },
  { 
    name: 'book', 
    schema: models.BookSchema, 
  },
  {
    name: 'profile',
    schema: models.ProfileSchema,
  },
  {
    name: 'userRating',
    schema: models.UserRatingSchema,
  },
  {
    name: 'universalText',
    schema: models.UniversalTextSchema,
  },
  {
    name: 'bookChapter',
    schema: models.BookChapterSchema,
  },
]);