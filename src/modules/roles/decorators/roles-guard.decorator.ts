import { applyDecorators, UseGuards } from '@nestjs/common';

import { RolesGuard as rG } from '../guards/roles.guard';

export function RolesGuard() {
    return applyDecorators(UseGuards(rG));
}
