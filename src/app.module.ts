import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { DynamooseModule } from './aws/dynamoose/dynamoose.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playgroud: true,
    }),
    DynamooseModule,
  ],
})
export class AppModule {}
