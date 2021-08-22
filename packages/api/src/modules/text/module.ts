import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { ProfilesService } from 'src/modules/profiles/services';
import { UserPermissionsService } from 'src/modules/permissions/services';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService, UserPermissionsService],
  exports: [...Object.values(services)],
})
export class UniversalTextModule {};