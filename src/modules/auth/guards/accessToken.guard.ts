import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx: GqlExecutionContext = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }
}
