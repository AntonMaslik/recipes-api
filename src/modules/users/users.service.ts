import { Injectable } from '@nestjs/common';

import { Model } from 'dynamoose/dist/Model';
import { UserModel } from './models/user.model';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private userModel: Model;

  constructor() {
    this.userModel = UserModel;
  }

  async createUser(createUserDto: CreateUserDTO) {
    const user = new UserModel(createUserDto);
    return user.save();
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDTO) {
    return this.userModel.update({
      uuid,
      ...updateUserDto,
    });
  }

  async deleteUserByUUID(uuid: string): Promise<any> {
    return this.userModel.delete(uuid);
  }

  async getUserByUUID(uuid: string): Promise<any> {
    return this.userModel.get(uuid);
  }
}
