import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'dynamoose/dist/Model';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserModel } from 'src/modules/users/models/user.model';

type JwtPayload = {
  sub: string;
  username: string;
  userDb: User;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private userModel: Model;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies.refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
    this.userModel = UserModel;
  }

  async validate(payload: JwtPayload) {
    const foundUser = await this.userModel.get(payload.sub);

    if (!foundUser || foundUser.length < 1) {
      throw new NotFoundException('User not found');
    }

    return {
      userDb: foundUser,
    };
  }
}
