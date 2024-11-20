import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersRepository } from './models/users.repository';

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(createUserDto: CreateUserDTO) {
        return this.usersRepository.create(createUserDto);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDTO) {
        return this.usersRepository.update(id, updateUserDto);
    }

    async deleteUserById(id: string): Promise<any> {
        return this.usersRepository.softDelete(id);
    }

    async getUserById(id: string): Promise<any> {
        return this.usersRepository.findById(id);
    }
}
