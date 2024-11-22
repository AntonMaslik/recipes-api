import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensDTO {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;
}
