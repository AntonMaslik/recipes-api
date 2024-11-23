import { CreateUserDTO } from '@modules/users/dto/create-user.dto';
import { UpdateUserDTO } from '@modules/users/dto/update-user.dto';
import { UserKey, UserModel } from '@modules/users/models/user.model';
import { QueryResponse, ScanResponse } from 'nestjs-dynamoose';
import { InjectModel, Model } from 'nestjs-dynamoose';

export class UsersRepository {
    @InjectModel('User')
    private readonly userModel: Model<UserModel, UserKey>;

    async softDelete(userId: string): Promise<UserModel> {
        const now: Date = new Date();

        return this.userModel.update(
            { id: userId },
            {
                deletedAt: now,
            },
        );
    }

    async findNonDeleted(): Promise<ScanResponse<UserModel>> {
        const users = await this.userModel
            .scan()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        return users;
    }

    async findById(id: string): Promise<UserModel> {
        const users: QueryResponse<UserModel> = await this.userModel
            .query('id')
            .eq(id)
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (users.length > 0) {
            return users[0];
        }
        return null;
    }

    async findByEmail(email: string): Promise<UserModel> {
        const users: ScanResponse<UserModel> = await this.userModel
            .scan('email')
            .eq(email)
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (users.length > 0) {
            return users[0];
        }
        return null;
    }

    async create(createUserDto: CreateUserDTO): Promise<UserModel> {
        return this.userModel.create(createUserDto);
    }

    async update(id: string, updateUserDto: UpdateUserDTO): Promise<UserModel> {
        return this.userModel.update({ id }, updateUserDto);
    }
}
