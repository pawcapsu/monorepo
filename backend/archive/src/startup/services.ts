// import * as AuthServices from 'src/modules/auth/services';
// import * as ProfilesServices from 'src/modules/profiles/services';
import * as CronServices from 'src/modules/cron/services';

export const Services = [
  // ...Object.values(AuthServices),
  // ...Object.values(ProfilesServices),
  ...Object.values(CronServices),
];