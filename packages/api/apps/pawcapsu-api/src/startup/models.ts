import * as models from '@pawcapsu/types/models';
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
  {
    name: 'tag',
    schema: models.TagSchema,
  },
  {
    name: 'exploreBadge',
    schema: models.ExploreBadgeSchema,
  }
], 'paw');