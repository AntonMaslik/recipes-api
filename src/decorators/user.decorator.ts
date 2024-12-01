import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx: GqlExecutionContext = GqlExecutionContext.create(context);

        const request: Request = ctx.getContext().req;

        return request.user.userDb;
    },
);
