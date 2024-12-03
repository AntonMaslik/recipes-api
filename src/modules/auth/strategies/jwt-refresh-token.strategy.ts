import { UserKey, UserModel } from '@modules/users/models/user.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies.refreshToken;
                },
            ]),
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(_request: Request, payload: JwtPayload) {
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
