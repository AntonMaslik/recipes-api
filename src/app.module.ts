import { Module } from '@nestjs/common';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { DynamooseModule } from './aws/dynamoose/dynamoose.module';
import { UsersModule } from './modules/users/users.module';
<<<<<<< Updated upstream
import { UsersResolver } from './modules/users/user.resolver';
=======
import { AuthResolver } from './modules/auth/resolves/auth.resolver';
import { UsersResolver } from './modules/users/resolvers/users.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { UserService } from './modules/users/users.service';
>>>>>>> Stashed changes

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    DynamooseModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
