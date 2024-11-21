import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    @Field()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Field()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    password: string;
}
