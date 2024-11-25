import { tokenSchema } from '@app/modules/tokens/models/token.model';
import { userSchema } from '@modules/users/models/user.model';
import { ModelDefinition } from 'nestjs-dynamoose';

export const dynamooseScheme: ModelDefinition[] = [
    {
        name: 'Token',
        schema: tokenSchema,
        options: {
            tableName: 'token',
        },
    },
    {
        name: 'User',
        schema: userSchema,
        options: {
            tableName: 'user',
        },
    },
];
