import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { tokenSchema } from './models/token.model';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Token',
        schema: tokenSchema,
        options: {
          tableName: 'token',
        },
      },
    ]),
  ],
  providers: [AuthService],
})
export class UserModule {}
