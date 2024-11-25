import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Cookie = createParamDecorator(
    (cookieName: string, context: ExecutionContext) => {
        const ctx: GqlExecutionContext = GqlExecutionContext.create(context);

        const request: any = ctx.getContext().req;

        return request.cookies[cookieName];
    },
);
