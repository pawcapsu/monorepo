import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

// Importing global mongoose plugins
import * as paginationPlugin from 'mongoose-paginate-v2';

// Importing modules
import * as ModuleList from '../startup/imports';
import 'src/types/enums';
import 'src/types/unions';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: "redis-16613.c244.us-east-1-2.ec2.cloud.redislabs.com",
        port: 16613,
        password: "cD14ZkN8VIKgEUMUJrC2ciEfAGzFMCze"
      }
    }),
    MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/production?retryWrites=true&w=majority', {
      connectionFactory: (connection) => {
        connection.plugin(paginationPlugin);
        return connection;
      },
      connectionName: 'paw'
    }),

    MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/notifier?retryWrites=true&w=majority', {
      connectionFactory: (connection) => {
        connection.plugin(paginationPlugin);
        return connection;
      },
      connectionName: 'service/notifier'
    }),

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