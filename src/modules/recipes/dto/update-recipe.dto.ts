import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateRecipeDTO {
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

    @IsString()
    @IsNotEmpty()
    @Field()
    image: string;

    @IsArray()
    @IsNotEmpty()
    @Field(() => [String])
    ingriditens: string[];

    @IsNumber()
    @IsNotEmpty()
    @Field()
    servingSize: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    cookingTime: string;

    @IsString()
    @Field({ nullable: true })
    userId: string;
}
