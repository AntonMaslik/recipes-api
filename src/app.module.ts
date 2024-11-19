import { Module } from '@nestjs/common';
import { DynamooseModule } from './aws/dynamoose/dynamoose.module';

@Module({
  imports: [DynamooseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
