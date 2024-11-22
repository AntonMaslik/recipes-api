import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { AuthService } from '../auth/auth.service';
import { tokenSchema } from './models/token.model';

@Module({
    imports: [
        DynamooseModule.forFeature([
            {
                name: 'Token',
                schema: tokenSchema,
                options: {
                    tableName: 'token',
                },
            },
        ]),
    ],
    providers: [AuthService],
})
export class UserModule {}
