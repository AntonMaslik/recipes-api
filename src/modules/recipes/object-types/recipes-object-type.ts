import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Recipe {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    image: string;

    @Field(() => [String])
    ingriditens: string[];

    @Field()
    servingSize: number;

    @Field()
    cookingTime: string;

    @Field()
    rating?: number;

    @Field()
    userId?: string;

    @Field()
    createdAt?: string;

    @Field()
    updatedAt?: string;
}
