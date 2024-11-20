import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserKey, UserModel } from 'src/modules/users/models/user.model';

type JwtPayload = {
    sub: string;
    username: string;
    userDb: User;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel('User')
        private userModel: Model<UserModel, UserKey>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const foundUser = await this.userModel.get({ id: payload.sub });

        if (!foundUser) {
            throw new NotFoundException('User not found');
        }

        return {
            ...payload,
            userDb: foundUser,
        };
    }
}
