import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class DynamoDBService {
  private dynamoDB: AWS.DynamoDB;
  private documentClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDB = new AWS.DynamoDB({
      endpoint: 'http://localhost:8000',
      region: 'us-west-2',
      accessKeyId: 'fakeAccessKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    });

    this.documentClient = new AWS.DynamoDB.DocumentClient({
      endpoint: 'http://localhost:8000',
      region: 'us-west-2',
      accessKeyId: 'fakeAccessKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    });
  }

  async createTable(): Promise<any> {
    const params = {
      TableName: 'TestTable',
      KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    return this.dynamoDB.createTable(params).promise();
  }

  async listTables(): Promise<any> {
    return this.dynamoDB.listTables().promise();
  }

  async putItem(tableName: string, item: Record<string, any>): Promise<any> {
    const params = {
      TableName: tableName,
      Item: item,
    };

    return this.documentClient.put(params).promise();
  }

  async getItem(tableName: string, key: Record<string, any>): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key,
    };

    return this.documentClient.get(params).promise();
  }
}
