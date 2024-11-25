import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateRecipeDTO {
    @IsString()
    @IsNotEmpty()
    @Field()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    title: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    body: string;

    @IsArray()
    @IsNotEmpty()
    @Field()
    ingriditens: string[];

    @IsNumber()
    @IsNotEmpty()
    @Field()
    servingSize: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    cookingTime: string;
}
