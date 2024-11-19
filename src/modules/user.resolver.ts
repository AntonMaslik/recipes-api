import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, UserModel } from './models/user.model';
import { CreateUserDTO } from './dto/create-user.dto';

@Resolver('User')
export class UsersResolver {
  @Query(() => [User])
  async getUsers(): Promise<any> {
    return UserModel.scan().exec();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDTO): Promise<any> {
    const { name, email, password } = input;

    const newUser = new UserModel({
      name,
      email,
      password,
    });

    return newUser.save();
  }
}
