import { UserModel } from 'src/modules/users/models/user.model';

declare global {
    namespace Express {
        export interface User {
            userDb: UserModel;
        }
    }
}
