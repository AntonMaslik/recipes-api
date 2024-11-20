import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInDTO {
    @Field()
    email: string;

    @Field()
    password: string;
}
