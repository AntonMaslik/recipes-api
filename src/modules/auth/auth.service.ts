import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/sign-up.dto';
import { UserKey, UserModel } from '../users/models/user.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/sign-in.dto';
import { TokensDTO } from '../tokens/dto/tokens.dto';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { TokenKey, TokenModel } from '../tokens/models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectModel('User')
    private userModel: Model<UserModel, UserKey>,

    @InjectModel('Token')
    private tokenModel: Model<TokenModel, TokenKey>,
  ) {}

  async signUp(signUpDto: SignUpDTO): Promise<TokensDTO> {
    const users = await this.userModel
      .scan()
      .where('email')
      .eq(signUpDto.email)
      .exec();

    if (users.length !== 0) {
      throw new ConflictException('User exists!');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const newUser = await this.userModel.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.name);

    await this.createRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(signInDto: SignInDTO): Promise<TokensDTO> {
    const users = await this.userModel
      .scan()
      .where('email')
      .eq(signInDto.email)
      .exec();

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
    await this.tokenModel.create({
      userId,
      refreshToken,
    });
  }

  // async logout(currentRefreshToken: string) {
  //   const tokens = await this.tokenModel.get({
  //     refreshToken: currentRefreshToken,
  //   });

  //   if (!tokens) {
  //     throw new ConflictException('Token not find!');
  //   }

  //   const token = tokens[0];

  //   await this.tokenModel.delete
  // }

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
