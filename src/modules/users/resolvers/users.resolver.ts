import { Args, Query, Resolver } from '@nestjs/graphql';
import { AccessGuard } from 'src/modules/auth/decorators/guard.decorators';

import { User, UserModel } from '../models/user.model';
import { UserService } from '../users.service';

@Resolver('User')
export class UsersResolver {
    constructor(private readonly usersService: UserService) {}

    @AccessGuard()
    @Query(() => User)
    async getUserById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<UserModel> {
        return this.usersService.getUserById(id);
    }
}
