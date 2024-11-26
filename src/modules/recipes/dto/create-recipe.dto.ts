import { createStepDTO } from '@modules/recipes/dto/create-step.dto';
import { Step } from '@modules/recipes/object-types/step-object-type';
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

    @IsString()
    @IsNotEmpty()
    @Field()
    image: string;

    @IsArray()
    @IsNotEmpty()
    @Field(() => [createStepDTO])
    steps: Step[];

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

    @IsNumber()
    @IsNotEmpty()
    @Field()
    rating?: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    userId?: string;
}
