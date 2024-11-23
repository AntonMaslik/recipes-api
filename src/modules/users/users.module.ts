import { userSchema } from '@modules/users/models/user.model';
import { UsersRepository } from '@modules/users/models/users.repository';
import { UsersResolver } from '@modules/users/resolvers/users.resolver';
import { UserService } from '@modules/users/users.service';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

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
                serializers: {
                    frontend: { exclude: ['status'] },
                },
            },
        ]),
    ],
})
export class UsersModule {}
