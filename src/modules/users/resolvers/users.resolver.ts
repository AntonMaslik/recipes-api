import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { User } from '../models/user.model';

import { UserService } from '../users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(() => User)
  async getUserByUUID(
    @Args('uuid', { type: () => String }) uuid: string,
  ): Promise<User> {
    return this.usersService.getUserByUUID(uuid);
  }
}
