import { Controller, Get } from "@nestjs/common";
import { QueueHandlerService } from "../services";

@Controller("service/notifier")
export class AgentsController {
  constructor(private readonly service: QueueHandlerService) {}

  @Get("test")
  public async test() {
    return await this.service.createAgent();
  }
}
