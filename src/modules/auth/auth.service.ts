import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { TokensDTO } from '../tokens/dto/tokens.dto';
import { TokenModel } from '../tokens/models/token.model';
import { TokensRepository } from '../tokens/models/tokens.repository';
import { UserModel } from '../users/models/user.model';
import { UsersRepository } from '../users/models/users.repository';
import { SignInDTO } from './dto/sign-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
        private readonly tokensRepository: TokensRepository,
    ) {}

    async signUp(signUpDto: SignUpDTO): Promise<TokensDTO> {
        const user: UserModel = await this.usersRepository.findByEmail(
            signUpDto.email,
        );

        if (user) {
            throw new ConflictException('User exists!');
        }

        const hashedPassword: string = await bcrypt.hash(
            signUpDto.password,
            10,
        );

        const newUser = await this.usersRepository.create({
            name: signUpDto.name,
            email: signUpDto.email,
            password: hashedPassword,
        });

        const tokens: { accessToken; refreshToken } = await this.getTokens(
            newUser.id,
            newUser.name,
        );

        await this.createRefreshToken(newUser.id, tokens.refreshToken);

        return tokens;
    }

    async signIn(signInDto: SignInDTO): Promise<TokensDTO> {
        const user: UserModel = await this.usersRepository.findByEmail(
            signInDto.email,
        );

        if (!user) {
            throw new ConflictException('User not exists!');
        }

        const passwordMatches: boolean = await bcrypt.compare(
            signInDto.password,
            user.password,
        );

        if (!passwordMatches) {
            throw new ConflictException('Invalid password!');
        }

        const tokens: { accessToken; refreshToken } = await this.getTokens(
            user.id,
            user.name,
        );

        await this.createRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async createRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<TokenModel> {
        return this.tokensRepository.create(refreshToken, userId);
    }

    async logout(currentRefreshToken: string): Promise<boolean> {
        const token: TokenModel =
            await this.tokensRepository.findByToken(currentRefreshToken);

        if (!token) {
            throw new ConflictException('Token not find!');
        }

        await this.tokensRepository.softDelete(token.id);

        return true;
    }

    async getTokens(
        userId: string,
        username: string,
    ): Promise<{ accessToken; refreshToken }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.JWT_EXPIRATION_ACCESS_SECRET,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: process.env.JWT_EXPIRATION_REFRESH_SECRET,
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<TokensDTO> {
        const token: TokenModel =
            await this.tokensRepository.findByToken(refreshToken);

        if (!token) {
            throw new NotFoundException('Token is not find');
        }

        const hash: string = await bcrypt.hash(refreshToken, 10);
        const refreshTokenMatches: boolean = await bcrypt.compare(
            token.refreshToken,
            hash,
        );

        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const user: UserModel = await this.usersRepository.findById(userId);

        const tokens: { accessToken; refreshToken } = await this.getTokens(
            user.id,
            user.name,
        );

        await this.createRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }
}
