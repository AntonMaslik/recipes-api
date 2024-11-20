import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { userSchema } from './models/user.model';
import { UsersRepository } from './models/users.repository';
import { UsersResolver } from './resolvers/users.resolver';
import { UserService } from './users.service';

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
