import { CreateUserDTO } from '@modules/users/dto/create-user.dto';
import { UpdateUserDTO } from '@modules/users/dto/update-user.dto';
import { UserModel } from '@modules/users/models/user.model';
import { UsersRepository } from '@modules/users/models/users.repository';
import { Injectable } from '@nestjs/common';

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
