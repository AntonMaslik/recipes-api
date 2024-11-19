import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'dynamoose/dist/Model';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserModel } from 'src/modules/users/models/user.model';

type JwtPayload = {
  sub: string;
  username: string;
  userDb: User;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  private userModel: Model;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
    this.userModel = UserModel;
  }

  async validate(payload: JwtPayload) {
    const foundUser = await this.userModel.get(payload.sub);

    if (!foundUser || foundUser.length < 1) {
      throw new NotFoundException('User not found');
    }

    return {
      ...payload,
      userDb: foundUser,
    };
  }
}
