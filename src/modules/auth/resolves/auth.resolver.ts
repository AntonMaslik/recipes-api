import { NotFoundException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { COOKIE_OPTIONS } from 'src/config/cookies.options';
import { TokensDTO } from 'src/modules/tokens/dto/tokens.dto';

import { AuthService } from '../auth.service';
import { AccessGuard, RefreshGuard } from '../decorators/guard.decorators';
import { SignInDTO } from '../dto/sign-in.dto';
import { SignUpDTO } from '../dto/sign-up.dto';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @AccessGuard()
    @Mutation(() => Boolean)
    async logout(@Context() context: any): Promise<boolean> {
        const { req, res } = context;

        const currentRefreshToken: string = req.cookies['refreshToken'];

        if (!currentRefreshToken) {
            throw new NotFoundException('Token is not find!');
        }

        res.clearCookie('refreshToken');

        return this.authService.logout(currentRefreshToken);
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

    @RefreshGuard()
    @Mutation(() => TokensDTO)
    async refreshToken(@Context() context: any): Promise<TokensDTO> {
        const { res } = context;

        const { accessToken, refreshToken } =
            await this.authService.refreshToken(
                res.user.id,
                res.cookies.refreshToken,
            );

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return { accessToken, refreshToken };
    }
}
