import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './resolves/auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService, AccessTokenStrategy, PassportModule],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_TOKEN,
      signOptions: { expiresIn: '12h' },
    }),
  ],
})
export class AuthModule {}
