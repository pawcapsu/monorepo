import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import * as ModuleList from './modules';

@Module({
  imports: [
    ...Object.values(ModuleList),
    ScheduleModule.forRoot(),
  ]
})
export class ServicesModules {};