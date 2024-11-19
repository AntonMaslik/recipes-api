import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserDTO {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}