import { Module } from '@nestjs/common';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { DynamooseModule } from 'nestjs-dynamoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    DynamooseModule.forRoot({
      local: true,
      aws: { region: 'fake-west-1' },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
