import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Role } from '../roles/roles.enum';
import { TokensDTO } from '../tokens/dto/tokens.dto';
import { TokenModel } from '../tokens/models/token.model';
import { TokensRepository } from '../tokens/models/tokens.repository';
import { UserModel } from '../users/models/user.model';
import { UsersRepository } from '../users/models/users.repository';
import { ChangePasswordDTO } from './dto/change-password.dto';
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
            roles: [Role.USER],
        });

        const tokens: { accessToken; refreshToken } = await this.getTokens(
            newUser.id,
            newUser.name,
        );

        const hashRefreshToken: string = await bcrypt.hash(
            tokens.refreshToken,
            10,
        );

        await this.tokensRepository.create(hashRefreshToken, newUser.id);

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

        const hashRefreshToken: string = await bcrypt.hash(
            tokens.refreshToken,
            10,
        );

        await this.tokensRepository.create(hashRefreshToken, user.id);

        return tokens;
    }

    async logout(currentRefreshToken: string): Promise<boolean> {
        const token: TokenModel =
            await this.tokensRepository.findByHash(currentRefreshToken);

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
            await this.tokensRepository.findByHash(refreshToken);

        const user: UserModel = await this.usersRepository.findById(userId);

        const tokens: { accessToken; refreshToken } = await this.getTokens(
            user.id,
            user.name,
        );

        const hashRefreshToken: string = await bcrypt.hash(
            tokens.refreshToken,
            10,
        );

        await this.tokensRepository.create(hashRefreshToken, user.id);

        await this.tokensRepository.softDelete(token.id);

        return tokens;
    }

    async changePassword(
        userId: string,
        changePasswordDto: ChangePasswordDTO,
    ): Promise<ChangePasswordDTO> {
        const user: UserModel = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException('User not find');
        }

        const currentPasswordMatches: boolean = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password,
        );

        if (!currentPasswordMatches) {
            throw new ForbiddenException('Wrong password');
        }

        const hashNewPassword: string = await bcrypt.hash(
            changePasswordDto.newPassword,
            10,
        );

        await this.usersRepository.update(userId, {
            name: user.name,
            password: hashNewPassword,
            email: user.email,
            roles: user.roles,
        });

        return changePasswordDto;
    }
}
