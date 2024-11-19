import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpDTO {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
