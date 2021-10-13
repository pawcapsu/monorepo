import { NestFactory } from "@nestjs/core";
import { NotifierModule } from "./notifier.module";

async function bootstrap() {
  const app = await NestFactory.create(NotifierModule);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
