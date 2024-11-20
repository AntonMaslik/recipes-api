import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { DynamooseModule } from 'nestjs-dynamoose';

import { userSchema } from './models/user.model';
import { UsersRepository } from './models/users.repository';

@Module({
  providers: [UsersResolver, UserService, UsersRepository],
  exports: [UserService],
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: userSchema,
        options: {
          tableName: 'user',
        },
      },
    ]),
  ],
})
export class UsersModule {}
