import { Module } from '@nestjs/common';
import { ProfilesService } from 'src/modules/profiles/services';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from 'src/types/models';

import * as controllers from 'src/modules/auth/controllers';
import * as services from 'src/modules/auth/services';

@Module({
  imports: [MongooseModule.forFeature([
    { 
      name: 'profile', 
      schema: ProfileSchema 
    }
  ])],
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(services), ProfilesService],
})
export class AuthModule {}