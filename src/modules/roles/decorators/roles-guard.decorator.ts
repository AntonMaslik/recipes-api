import { RolesGuard as rG } from '@modules/roles/guards/roles.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function RolesGuard() {
    return applyDecorators(UseGuards(rG));
}
