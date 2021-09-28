import { Controller, Get } from '@nestjs/common';
import { AgentsService } from '../services';

@Controller('service/notifier')
export class AgentsController {
  constructor(
    private readonly service: AgentsService,
  ) {}

  // @Get('test')
  // public async test() {
  //   return await this.service.createAgent();
  // };
};