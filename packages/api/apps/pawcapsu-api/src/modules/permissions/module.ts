import { Module } from "@nestjs/common";
import { Services } from "@pawcapsu/startup/services";

import * as services from "./services";

Module({
  providers: [...Object.values(Services)],
  exports: [...Object.values(services)],
});
export class PermissionsModule {}
