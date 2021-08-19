import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ModelsImports } from 'src/startup/models';

// Importing modules
import * as ModuleList from '../startup/imports';
import 'src/types/enums';
import 'src/types/unions';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/production?retryWrites=true&w=majority'),

    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      cors: {
        origin: process.env.MODE === 'PRODUCTION' ? 'https://www.pawcapsu.ml' : 'http://localhost:3000',
        credentials: true,
      },
    }),
    
    ...Object.values(ModuleList),
  ],
})
export class AppModule {}