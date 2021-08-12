import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import * as fs from 'fs';

export default async function(): Promise<void> {
  let httpsOptions;
  try {
    httpsOptions = {
      key: fs.readFileSync('../secrets/server.key'),
      cert: fs.readFileSync('../secrets/server.cert'),
    };
  } catch(error) {};
 
  const app = await NestFactory.create(AppModule, {
    httpsOptions: process.env.MODE === 'PRODUCTION' ? httpsOptions : null,
  });
  
  const config = new DocumentBuilder()
    .setTitle('pawcapsu')
    .setDescription('api.pawcapsu.ml documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.enableCors();
  await app.listen(3000);
};