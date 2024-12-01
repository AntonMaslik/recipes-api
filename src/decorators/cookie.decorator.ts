import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const Cookie = createParamDecorator(
    (cookieName: string, context: ExecutionContext) => {
        const ctx: GqlExecutionContext = GqlExecutionContext.create(context);

        const request: Request = ctx.getContext().req;

        return request.cookies[cookieName];
    },
);
