import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Importing modules
import * as ModuleList from '../startup/imports';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // ConfigModule.forRoot(),
    // MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/production?retryWrites=true&w=majority'),

    // GraphQLModule.forRoot({
    //   autoSchemaFile: 'schema.gql',
    //   context: ({ req }) => ({ req }),
    //   cors: {
    //     origin: process.env.MODE === 'PRODUCTION' ? 'https://www.ctrlpaint.ru' : 'http://localhost:3000',
    //     credentials: true,
    //   },
    // }),
    
    ...Object.values(ModuleList),
  ],
})
export class AppModule {}