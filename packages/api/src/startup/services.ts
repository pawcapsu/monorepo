import * as AuthServices from 'src/modules/auth/services';
import * as BooksServices from 'src/modules/books/services';
import * as ChaptersServices from 'src/modules/chapters/services';
import * as RatingsServices from 'src/modules/interactions/rating/services';
import * as PermissionsServices from 'src/modules/permissions/services';
import * as GlobalPlacesServices from 'src/modules/places/global/services';
import * as ProfilesServices from 'src/modules/profiles/services';
import * as TextServices from 'src/modules/text/services';
import * as TagServices from 'src/modules/interactions/tag/services';
import * as ExploreServices from 'src/modules/explore/services';

export const Services = [
  ...Object.values(AuthServices),
  ...Object.values(BooksServices),
  ...Object.values(ChaptersServices),
  ...Object.values(RatingsServices),
  ...Object.values(PermissionsServices),
  ...Object.values(GlobalPlacesServices),
  ...Object.values(ProfilesServices),
  ...Object.values(TextServices),
  ...Object.values(TagServices),
  ...Object.values(ExploreServices),
];