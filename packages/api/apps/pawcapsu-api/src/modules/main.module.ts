import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Importing global mongoose plugins
import * as paginationPlugin from 'mongoose-paginate-v2';

// Importing modules
import * as ModuleList from '../startup/imports';
import 'apps/pawcapsu-api/src/types/enums';
import 'apps/pawcapsu-api/src/types/unions';

@Module({
  imports: [
    ConfigModule.forRoot(),
    
    MongooseModule.forRoot('mongodb+srv://paws:kxz2zyGxIO28JaCR@cluster0.03jyp.mongodb.net/production?retryWrites=true&w=majority', {
      connectionFactory: (connection) => {
        connection.plugin(paginationPlugin);
        return connection;
      },
      connectionName: 'paw'
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