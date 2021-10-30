import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { Services } from 'src/startup/services';

@Module({
  providers: [...Object.values(Services)],
})
export class CronModule {}