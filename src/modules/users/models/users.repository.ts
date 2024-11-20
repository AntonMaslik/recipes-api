import { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import { InjectModel, Model } from 'nestjs-dynamoose';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserKey, UserModel } from './user.model';

export class UsersRepository {
    @InjectModel('User')
    private userModel: Model<UserModel, UserKey>;

    async softDelete(userId: string): Promise<UserModel> {
        const now: Date = new Date();
        return await this.userModel.update(
            { id: userId },
            {
                deletedAt: now,
            },
        );
    }

    async findNonDeleted(): Promise<ScanResponse<UserModel>> {
        const scanResponse = await this.userModel
            .scan()
            .where('deletedAt')
            .eq(null)
            .exec();

        const plainItems = scanResponse.map((item) => item.toJSON());

        return {
            ...scanResponse,
            items: plainItems,
        } as unknown as ScanResponse<UserModel>;
    }

    async findById(userId: string): Promise<UserModel> {
        const user: UserModel = await this.userModel.get({ id: userId });
        if (user && user.deletedAt !== null) {
            return null;
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserModel> {
        const users = await this.userModel.scan('email').eq(email).exec();

        const user: UserModel = users[0];

        if (user.deletedAt) {
            return null;
        }

        return user;
    }

    async create(createUserDto: CreateUserDTO): Promise<UserModel> {
        return await this.userModel.create(createUserDto);
    }

    async update(id: string, updateUserDto: UpdateUserDTO): Promise<UserModel> {
        return await this.userModel.update({ id }, updateUserDto);
    }
}
