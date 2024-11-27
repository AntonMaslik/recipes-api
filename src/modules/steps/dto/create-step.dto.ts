import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateStepDTO {
    @IsNotEmpty()
    @IsString()
    @Field()
    title: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    body: string;

    @IsNotEmpty()
    @IsNumber()
    @Field()
    position: number;

    @IsString()
    @Field()
    media: string;
}
