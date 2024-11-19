import { Module } from '@nestjs/common';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { DynamooseModule } from './aws/dynamoose/dynamoose.module';
import { UsersModule } from './modules/users/users.module';
import { UsersResolver } from './modules/users/resolvers/user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    DynamooseModule,
    UsersModule,
  ],
  providers: [UsersResolver],
})
export class AppModule {}
