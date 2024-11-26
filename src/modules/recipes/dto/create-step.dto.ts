import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class createStepDTO {
    @IsString()
    @Field()
    title: string;

    @IsString()
    @Field()
    body: string;

    @IsNumber()
    @Field()
    position: number;

    @IsString()
    @Field()
    media: string;
}
