import { Controller, Get } from "@nestjs/common";
import { SubscribersService } from "../services";

@Controller("service/notifier")
export class AgentsController {
  constructor(private readonly service: SubscribersService) {}

  @Get("test")
  public async test() {
    return await this.service.createAgent();
  }
}
