import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { TokensDTO } from 'src/modules/tokens/dto/tokens.dto';

import { AuthService } from '../auth.service';
import { SignInDTO } from '../dto/sign-in.dto';
import { SignUpDTO } from '../dto/sign-up.dto';
import { COOKIE_OPTIONS } from 'src/config/cookies.options';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Boolean)
    async logout(@Context() context: any): Promise<boolean> {
        const { req, res } = context;

        const currentRefreshToken: string = req.cookies['refreshToken'];

        return this.authService.logout(res, currentRefreshToken);
    }

    @Mutation(() => TokensDTO)
    async signUp(
        @Args('input') signUpDTO: SignUpDTO,
        @Context() context: any,
    ): Promise<TokensDTO> {
        const { res } = context;

        const tokens: TokensDTO = await this.authService.signUp(signUpDTO);

        res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

        return tokens;
    }

    @Mutation(() => TokensDTO)
    async signIn(
        @Args('input') signInDTO: SignInDTO,
        @Context() context: any,
    ): Promise<TokensDTO> {
        const { res } = context;

        const tokens: TokensDTO = await this.authService.signIn(signInDTO);

        res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

        return tokens;
    }
}
