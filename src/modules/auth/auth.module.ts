import { AuthService } from '@modules/auth/auth.service';
import { AuthResolver } from '@modules/auth/resolves/auth.resolver';
import { AccessTokenStrategy } from '@modules/auth/strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from '@modules/auth/strategies/jwt-refresh-token.strategy';
import { tokenSchema } from '@modules/tokens/models/token.model';
import { TokensRepository } from '@modules/tokens/models/tokens.repository';
import { userSchema } from '@modules/users/models/user.model';
import { UsersRepository } from '@modules/users/models/users.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DynamooseModule } from 'nestjs-dynamoose';

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
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_SECRET_TOKEN },
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
