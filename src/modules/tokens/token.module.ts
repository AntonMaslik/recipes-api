import { dynamooseScheme } from '@app/config/db.schema';
import { AuthService } from '@modules/auth/auth.service';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
    providers: [AuthService],
})
export class UserModule {}
