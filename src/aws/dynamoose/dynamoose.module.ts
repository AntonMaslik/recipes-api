import { Module } from '@nestjs/common';
import * as dynamoose from 'dynamoose';

@Module({})
export class DynamooseModule {
  constructor() {
    dynamoose.aws.ddb.local('http://localhost:8000');
  }
}
