import { dynamooseScheme } from '@app/config/db.schema';
import { AuthService } from '@modules/auth/auth.service';
import { AuthResolver } from '@modules/auth/resolves/auth.resolver';
import { AccessTokenStrategy } from '@modules/auth/strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from '@modules/auth/strategies/jwt-refresh-token.strategy';
import { TokensRepository } from '@modules/tokens/models/tokens.repository';
import { UsersRepository } from '@modules/users/models/users.repository';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET_TOKEN'),
                signOptions: {
                    expiresIn: configService.getOrThrow<string>(
                        'JWT_EXPIRATION_SECRET_TOKEN',
                    ),
                },
            }),
            inject: [ConfigService],
        }),
        DynamooseModule.forFeature(dynamooseScheme),
    ],
})
export class AuthModule {}
