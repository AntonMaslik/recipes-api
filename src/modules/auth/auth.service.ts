import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/sign-up.dto';
import { Model } from 'dynamoose/dist/Model';
import { UserModel } from '../models/user.model';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private userModel: Model;

  constructor() {
    this.userModel = UserModel;
  }

  async signUp(signUpDto: SignUpDTO) {
    const user = await this.userModel
      .scan()
      .where('email')
      .eq(signUpDto.email)
      .exec();

    if (!user || user.length > 0) {
      throw new ConflictException('User exists!');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    return this.userModel.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });
  }

  async signIn() {}

  async logout() {}

  async refreshToken() {}

  async changePassword() {}
}
