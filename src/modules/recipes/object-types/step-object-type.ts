import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Step {
    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    position: number;

    @Field()
    media: string;
}
