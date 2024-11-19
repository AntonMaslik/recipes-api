import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { SignUpDTO } from '../dto/sign-up.dto';
import { AuthService } from '../auth.service';
import { TokensDTO } from 'src/modules/tokens/dto/tokens.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokensDTO)
  async signUp(
    @Args('input') signUpDTO: SignUpDTO,
    @Context() context: any,
  ): Promise<TokensDTO> {
    const { res } = context;

    const tokens = await this.authService.signUp(signUpDTO);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return tokens;
  }
}
