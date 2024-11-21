import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    getRequest(context: ExecutionContext) {
        const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const { user } = context.switchToHttp().getRequest();

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return false;
        }

        const roles: string[] = user.UserDb.roles;

        return requiredRoles.some((role) => roles?.includes(role));
    }
}
