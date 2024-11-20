import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserKey, UserModel } from './user.model';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export class UsersRepository {
  @InjectModel('User')
  private userModel: Model<UserModel, UserKey>;

  async softDelete(userId: string): Promise<void> {
    const now = new Date();
    await this.userModel.update(
      { id: userId },
      {
        deletedAt: now,
      },
    );
  }

  async findNonDeleted(): Promise<any[]> {
    return await this.userModel.scan().where('deletedAt').eq(null).exec();
  }

  async findById(userId: string): Promise<any> {
    const user = await this.userModel.get({ id: userId });
    if (user && user.deletedAt !== null) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const users = await this.userModel.scan('email').eq(email).exec();

    const user = users[0];

    if (user && user.deletedAt !== null) {
      return null;
    }

    return user;
  }

  async create(createUserDto: CreateUserDTO) {
    return await this.userModel.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDTO) {
    return await this.userModel.update({ id }, updateUserDto);
  }
}
