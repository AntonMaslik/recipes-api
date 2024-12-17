import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInDTO {
    @IsEmail()
    @IsNotEmpty()
    @Field()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    password: string;
}
