import { Module } from '@nestjs/common';

import * as services from './services';

Module({
  providers: [...Object.values(services)],
  exports: [...Object.values(services)]
})
export class PermissionsModule {};