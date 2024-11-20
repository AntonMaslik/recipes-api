import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from '../models/user.model';
import { UserService } from '../users.service';

@Resolver('User')
export class UsersResolver {
    constructor(private readonly usersService: UserService) {}

    @Query(() => User)
    async getUserById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<User> {
        return this.usersService.getUserById(id);
    }
}
