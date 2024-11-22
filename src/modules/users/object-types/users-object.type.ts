import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field()
    deleteAt: string;
}
