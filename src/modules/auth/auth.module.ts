import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DynamooseModule } from 'nestjs-dynamoose';

import { tokenSchema } from '../tokens/models/token.model';
import { TokensRepository } from '../tokens/models/tokens.repository';
import { userSchema } from '../users/models/user.model';
import { UsersRepository } from '../users/models/users.repository';
import { AuthService } from './auth.service';
import { AuthResolver } from './resolves/auth.resolver';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';

@Module({
    providers: [
        AuthService,
        AuthResolver,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        UsersRepository,
        TokensRepository,
    ],
    exports: [AuthService, AccessTokenStrategy, PassportModule],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET_TOKEN,
            signOptions: { expiresIn: '12h' },
        }),
        DynamooseModule.forFeature([
            {
                name: 'Token',
                schema: tokenSchema,
                options: {
                    tableName: 'token',
                },
            },
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
export class AuthModule {}
