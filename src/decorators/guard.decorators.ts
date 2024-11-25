import { AccessTokenGuard } from '@modules/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from '@modules/auth/guards/refreshToken.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function AccessGuard() {
    return applyDecorators(UseGuards(AccessTokenGuard));
}

export function RefreshGuard() {
    return applyDecorators(UseGuards(RefreshTokenGuard));
}
