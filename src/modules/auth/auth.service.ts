import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/sign-up.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/sign-in.dto';
import { TokensDTO } from '../tokens/dto/tokens.dto';
import { UsersRepository } from '../users/models/users.repository';
import { TokensRepository } from '../tokens/models/tokens.repository';
import { UserModel } from '../users/models/user.model';

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

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const newUser = await this.usersRepository.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.name);

    await this.createRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(signInDto: SignInDTO): Promise<TokensDTO> {
    const users = await this.usersRepository.findByEmail(signInDto.email);

    if (users.length === 0) {
      throw new ConflictException('User not exists!');
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new ConflictException('Invalid password!');
    }

    const tokens = await this.getTokens(user.id, user.name);

    await this.createRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async createRefreshToken(userId: string, refreshToken: string) {
    await this.tokensRepository.create(refreshToken, userId);
  }

  async logout(currentRefreshToken: string) {
    const token = await this.tokensRepository.findByToken(currentRefreshToken);

    if (!token) {
      throw new ConflictException('Token not find!');
    }

    await this.tokensRepository.softDelete(token.id);
  }

  async refreshToken() {}

  async changePassword() {}

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
}
