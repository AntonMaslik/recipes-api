import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserKey, UserModel } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserModel, UserKey>,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    return this.userModel.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    return this.userModel.update({
      id,
      ...updateUserDto,
    });
  }

  async deleteUserById(id: string): Promise<any> {
    return this.userModel.delete({ id });
  }

  async getUserById(id: string): Promise<any> {
    return this.userModel.get({ id });
  }
}
