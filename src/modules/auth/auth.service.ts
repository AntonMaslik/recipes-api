import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/sign-up.dto';
import { Model } from 'dynamoose/dist/Model';
import { UserModel } from '../users/models/user.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/sign-in.dto';
import { TokenModel } from '../tokens/models/token.model';

@Injectable()
export class AuthService {
  private userModel: Model;
  private tokenModel: Model;

  constructor(private jwtService: JwtService) {
    this.userModel = UserModel;
    this.tokenModel = TokenModel;
  }

  async signUp(signUpDto: SignUpDTO) {
    const user = await this.userModel
      .scan()
      .where('email')
      .eq(signUpDto.email)
      .limit(1)
      .exec();

    if (user.length === 0) {
      throw new ConflictException('User exists!');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    return this.userModel.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });
  }

  async signIn(signInDto: SignInDTO) {
    const users = await this.userModel
      .scan()
      .where('email')
      .eq(signInDto.email)
      .exec();

    if (users.length === 0) {
      throw new ConflictException('User exists!');
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new ConflictException('Invalid password!');
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.name,
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.update({ id: userId }, { refreshToken });
  }

  async logout() {}

  async refreshToken() {}

  async changePassword() {}

  async getTokens(userId: number, username: string) {
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
