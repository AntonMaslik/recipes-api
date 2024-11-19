import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from 'src/modules/users/models/user.model';
import { SignUpDTO } from '../dto/sign-up.dto';
import { AuthService } from '../auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(@Args('input') signUpDTO: SignUpDTO): Promise<any> {
    return this.authService.signUp(signUpDTO);
  }
}
