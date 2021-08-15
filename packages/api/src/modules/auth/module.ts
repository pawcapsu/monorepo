import { Module } from '@nestjs/common';
import { ProfilesService } from 'src/modules/profiles/services';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from 'src/types/models';

import * as resolvers from 'src/modules/auth/resolvers';
import * as services from 'src/modules/auth/services';

@Module({
  imports: [MongooseModule.forFeature([
    { 
      name: 'profile', 
      schema: ProfileSchema 
    }
  ])],
  providers: [...Object.values(resolvers), ...Object.values(services), ProfilesService],
})
export class AuthModule {}