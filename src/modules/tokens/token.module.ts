import { AuthService } from '@modules/auth/auth.service';
import { tokenSchema } from '@modules/tokens/models/token.model';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

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
