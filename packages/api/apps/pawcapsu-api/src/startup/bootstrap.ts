import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import * as session from 'express-session';

export default async function(): Promise<void> {
  const app = await NestFactory.create(AppModule, {});

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('pawcapsu')
    .setDescription('api.pawcapsu.ml documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.MODE === "PRODUCTION" ? 3000 : 3001);
};