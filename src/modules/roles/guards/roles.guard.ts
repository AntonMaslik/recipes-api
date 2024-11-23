import { ROLES_KEY } from '@modules/roles/decorators/roles.decorator';
import { Role } from '@modules/roles/roles.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

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
        const { req } = context.switchToHttp().getNext();

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return false;
        }

        const roles: string[] = req.user.userDb.roles;

        return requiredRoles.some((role) => roles?.includes(role));
    }
}
