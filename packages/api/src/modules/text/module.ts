import { Module } from '@nestjs/common';
import { ModelsImports } from 'src/startup/models';

import * as resolvers from './resolvers';
import * as services from './services';

@Module({
  imports: [ModelsImports],
  providers: [...Object.values(resolvers), ...Object.values(services)],
  exports: [...Object.values(services)],
})
export class UniversalTextModule {};