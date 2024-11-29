import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateRecipeDTO {
    @IsString()
    @Field()
    name?: string;

    @IsString()
    @Field()
    title?: string;

    @IsString()
    @Field()
    body?: string;

    @IsString()
    @Field()
    image?: string;

    @IsNumber()
    @Field()
    rating?: number;

    @IsArray()
    @Field(() => [String])
    ingriditens?: string[];

    @IsNumber()
    @Field()
    servingSize?: number;

    @IsString()
    @Field()
    cookingTime?: string;

    @IsString()
    @Field()
    userId?: string;
}
