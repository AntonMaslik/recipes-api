import { dynamooseScheme } from '@app/config/db.schema';
import { TokensRepository } from '@app/modules/tokens/models/tokens.repository';
import { UsersRepository } from '@app/modules/users/models/users.repository';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthService } from '@modules/auth/auth.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    imports: [DynamooseModule.forFeature(dynamooseScheme), UsersModule],
    providers: [AuthService, JwtService, UsersRepository, TokensRepository],
})
export class TokensModule {}
