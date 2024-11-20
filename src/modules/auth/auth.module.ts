import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './resolves/auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { DynamooseModule } from 'nestjs-dynamoose';
import { tokenSchema } from '../tokens/models/token.model';
import { userSchema } from '../users/models/user.model';
import { UsersRepository } from '../users/models/users.repository';
import { TokensRepository } from '../tokens/models/tokens.repository';

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
