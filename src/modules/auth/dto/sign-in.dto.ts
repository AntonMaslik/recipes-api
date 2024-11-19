import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignInDTO {
  @Field()
  email: string;

  @Field()
  password: string;
}
