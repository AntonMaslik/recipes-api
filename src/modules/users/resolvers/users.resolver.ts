import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { AccessGuard } from 'src/modules/auth/decorators/guard.decorators';
import { Roles } from 'src/modules/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/roles/decorators/roles-guard.decorator';
import { Role } from 'src/modules/roles/roles.enum';

import { UserModel } from '../models/user.model';
import { User } from '../object-types/users-object.type';
import { UserService } from '../users.service';

@AccessGuard()
@Resolver('User')
export class UsersResolver {
    constructor(private readonly usersService: UserService) {}

    @Query(() => User)
    async getUserById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<UserModel> {
        return this.usersService.getUserById(id);
    }

    @Query(() => User)
    async getMe(@Context() context: any): Promise<UserModel> {
        const { req } = context;

        return this.usersService.getUserById(req.user.userDb.id);
    }

    @RolesGuard()
    @Roles(Role.ADMIN)
    @Query(() => User)
    async deleteUser(
        @Args('id', { type: () => String }) id: string,
    ): Promise<UserModel> {
        return this.usersService.deleteUserById(id);
    }
}
