import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    @Field()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    newPassword: string;
}
