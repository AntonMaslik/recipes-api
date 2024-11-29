import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Rate {
    @Field()
    recipeId: string;

    @Field()
    userId: string;

    @Field()
    evaluation: number;
}
