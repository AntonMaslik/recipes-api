import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { SignUpDTO } from '../dto/sign-up.dto';
import { AuthService } from '../auth.service';
import { TokensDTO } from 'src/modules/tokens/dto/tokens.dto';
import { SignInDTO } from '../dto/sign-in.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Boolean)
  async logout(@Context() context: any) {
    const { req, res } = context;

    const currentRefreshToken = req.cookies['refreshToken'];

    return await this.authService.logout(res, currentRefreshToken);
  }

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

  @Mutation(() => TokensDTO)
  async signIn(
    @Args('input') signInDTO: SignInDTO,
    @Context() context: any,
  ): Promise<TokensDTO> {
    const { res } = context;

    const tokens = await this.authService.signIn(signInDTO);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return tokens;
  }
}
