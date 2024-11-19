import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  providers: [UsersResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
