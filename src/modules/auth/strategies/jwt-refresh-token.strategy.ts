import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserKey, UserModel } from 'src/modules/users/models/user.model';

type JwtPayload = {
    sub: string;
    username: string;
    userDb: UserModel;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        @InjectModel('User')
        private userModel: Model<UserModel, UserKey>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies.refreshToken;
                },
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(payload: JwtPayload) {
        const foundUser: UserModel = await this.userModel.get({
            id: payload.sub,
        });

        if (!foundUser) {
            throw new NotFoundException('User not found');
        }

        return {
            userDb: foundUser,
        };
    }
}
