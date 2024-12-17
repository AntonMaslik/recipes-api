import { UserModel } from '@app/modules/users/models/user.model';

declare module 'express' {
    export interface Request {
        user?: {
            userDb: UserModel;
        };
    }
}
