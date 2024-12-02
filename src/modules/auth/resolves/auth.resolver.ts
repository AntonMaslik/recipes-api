import { COOKIE_OPTIONS } from '@app/config/cookies.options';
import { Cookie } from '@app/decorators/cookie.decorator';
import { AccessGuard, RefreshGuard } from '@app/decorators/guard.decorators';
import { User } from '@app/decorators/user.decorator';
import { UserModel } from '@app/modules/users/models/user.model';
import { GraphqlContext } from '@app/types/graphql.context';
import { AuthService } from '@modules/auth/auth.service';
import { ChangePasswordDTO } from '@modules/auth/dto/change-password.dto';
import { SignInDTO } from '@modules/auth/dto/sign-in.dto';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { ChangePassword } from '@modules/auth/object-types/change-password.type';
import { TokensDTO } from '@modules/tokens/dto/tokens.dto';
import { NotFoundException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @AccessGuard()
    @Mutation(() => Boolean, {
        name: 'logout',
    })
    async logout(
        @Cookie('refreshToken') refreshToken: string,
        @Context() context: GraphqlContext,
    ): Promise<boolean> {
        const { res }: GraphqlContext = context;

        const currentRefreshToken: string = refreshToken;

        if (!currentRefreshToken) {
            throw new NotFoundException('Token is not find!');
        }

        res.clearCookie('refreshToken');

        return this.authService.logout(currentRefreshToken);
    }

    @Mutation(() => TokensDTO, {
        name: 'signUp',
    })
    async signUp(
        @Args('input') signUpDTO: SignUpDTO,
        @Context() context: GraphqlContext,
    ): Promise<TokensDTO> {
        const { res }: GraphqlContext = context;

        const tokens: TokensDTO = await this.authService.signUp(signUpDTO);

        res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

        return tokens;
    }

    @Mutation(() => TokensDTO, {
        name: 'signIn',
    })
    async signIn(
        @Args('input') signInDTO: SignInDTO,
        @Context() context: GraphqlContext,
    ): Promise<TokensDTO> {
        const { res }: GraphqlContext = context;

        const tokens: TokensDTO = await this.authService.signIn(signInDTO);

        res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);

        return tokens;
    }

    @RefreshGuard()
    @Mutation(() => TokensDTO, {
        name: 'refresh',
    })
    async refreshToken(
        @User() user: UserModel,
        @Cookie('refreshToken') currentRefreshToken,
        @Context() context: GraphqlContext,
    ): Promise<TokensDTO> {
        const { res }: GraphqlContext = context;

        const { accessToken, refreshToken } =
            await this.authService.refreshToken(user.id, currentRefreshToken);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return { accessToken, refreshToken };
    }

    @AccessGuard()
    @Mutation(() => ChangePassword, { name: 'changePassword' })
    async changePassword(
        @User() user: UserModel,
        @Args('input') changePasswordDto: ChangePasswordDTO,
    ): Promise<ChangePasswordDTO> {
        return this.authService.changePassword(user.id, changePasswordDto);
    }
}
