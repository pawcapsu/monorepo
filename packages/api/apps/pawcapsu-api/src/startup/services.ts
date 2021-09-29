import * as AuthServices from '@pawcapsu/modules/auth/services';
import * as BooksServices from '@pawcapsu/modules/books/services';
import * as ChaptersServices from '@pawcapsu/modules/chapters/services';
import * as RatingsServices from '@pawcapsu/modules/interactions/rating/services';
import * as PermissionsServices from '@pawcapsu/modules/permissions/services';
import * as GlobalPlacesServices from '@pawcapsu/modules/places/global/services';
import * as ProfilesServices from '@pawcapsu/modules/profiles/services';
import * as TextServices from '@pawcapsu/modules/text/services';
import * as TagServices from '@pawcapsu/modules/interactions/tag/services';
import * as ExploreServices from '@pawcapsu/modules/explore/services';

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