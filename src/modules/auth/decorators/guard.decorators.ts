import { applyDecorators, UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

export function AccessGuard() {
    return applyDecorators(UseGuards(AccessTokenGuard));
}

export function RefreshGuard() {
    return applyDecorators(UseGuards(RefreshTokenGuard));
}
