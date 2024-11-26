import { createStepDTO } from '@app/modules/recipes/dto/create-step.dto';
import { Step } from '@app/modules/recipes/models/recipe.model';
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
    @Field(() => [createStepDTO])
    steps: Step[];

    @IsArray()
    @IsNotEmpty()
    @Field(() => [String])
    ingriditens!: string[];

    @IsNumber()
    @IsNotEmpty()
    @Field()
    servingSize: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    cookingTime: string;

    @IsNumber()
    @Field()
    rating?: number;

    @IsString()
    @Field()
    userId?: string;
}
