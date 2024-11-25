import { ChangePasswordDTO } from '@modules/auth/dto/change-password.dto';
import { SignInDTO } from '@modules/auth/dto/sign-in.dto';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { Role } from '@modules/roles/roles.enum';
import { TokensDTO } from '@modules/tokens/dto/tokens.dto';
import { TokenModel } from '@modules/tokens/models/token.model';
import { TokensRepository } from '@modules/tokens/models/tokens.repository';
import { UserModel } from '@modules/users/models/user.model';
import { UsersRepository } from '@modules/users/models/users.repository';
import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { generateHash } from '@utils/hash.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
        private readonly tokensRepository: TokensRepository,
        private readonly configService: ConfigService,
    ) {}

    async signUp(signUpDto: SignUpDTO): Promise<TokensDTO> {
        const user: UserModel = await this.usersRepository.findByEmail(
            signUpDto.email,
        );

        if (user) {
            throw new ConflictException('User exists!');
        }

        const hashedPassword: string = await generateHash(signUpDto.password);

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

        const hashRefreshToken: string = await generateHash(
            tokens.refreshToken,
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

        const hashRefreshToken: string = await generateHash(
            tokens.refreshToken,
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
                    secret: this.configService.getOrThrow<string>(
                        'JWT_ACCESS_SECRET',
                    ),
                    expiresIn: this.configService.getOrThrow<string>(
                        'JWT_EXPIRATION_ACCESS_SECRET',
                    ),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.getOrThrow<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                    expiresIn: this.configService.getOrThrow<string>(
                        'JWT_EXPIRATION_REFRESH_SECRET',
                    ),
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

        const hashRefreshToken: string = await generateHash(
            tokens.refreshToken,
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

        const hashNewPassword: string = await generateHash(
            changePasswordDto.newPassword,
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
