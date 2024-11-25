import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Recipe {
    @Field()
    id?: string;

    @Field()
    name?: string;

    @Field()
    title?: string;

    @Field()
    body?: string;

    @Field()
    image?: string;

    @Field()
    ingriditens?: string[];

    @Field()
    servingSize?: number;

    @Field()
    cookingTime?: string;

    @Field()
    createdAt?: string;

    @Field()
    updatedAt?: string;

    @Field()
    deleteAt?: string;
}
