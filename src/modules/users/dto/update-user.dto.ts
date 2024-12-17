import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateUserDTO {
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

    @IsArray()
    roles: string[];
}
