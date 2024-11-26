import { AccessGuard } from '@app/decorators/guard.decorators';
import { User as UserDecorator } from '@app/decorators/user.decorator';
import { Roles } from '@modules/roles/decorators/roles.decorator';
import { RolesGuard } from '@modules/roles/decorators/roles-guard.decorator';
import { Role } from '@modules/roles/roles.enum';
import { UserModel } from '@modules/users/models/user.model';
import { User } from '@modules/users/object-types/users-object.type';
import { UserService } from '@modules/users/users.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
    async getMe(@UserDecorator() user: UserModel): Promise<UserModel> {
        return this.usersService.getUserById(user.id);
    }

    @RolesGuard()
    @Roles(Role.ADMIN)
    @Mutation(() => User)
    async deleteUser(
        @Args('id', { type: () => String }) id: string,
    ): Promise<UserModel> {
        return this.usersService.deleteUserById(id);
    }
}
