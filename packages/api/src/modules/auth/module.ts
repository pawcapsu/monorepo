import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import { ProfilesService } from 'src/modules/profiles/services';

import * as resolvers from 'src/modules/auth/resolvers';
import * as services from 'src/modules/auth/services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService],
})
export class AuthModule {}