import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { UsersRepository } from './models/users.repository';

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDTO): Promise<UserModel> {
        return this.usersRepository.create(createUserDto);
    }

    async updateUser(
        id: string,
        updateUserDto: UpdateUserDTO,
    ): Promise<UserModel> {
        return this.usersRepository.update(id, updateUserDto);
    }

    async deleteUserById(id: string): Promise<UserModel> {
        return this.usersRepository.softDelete(id);
    }

    async getUserById(id: string): Promise<UserModel> {
        return this.usersRepository.findById(id);
    }
}
