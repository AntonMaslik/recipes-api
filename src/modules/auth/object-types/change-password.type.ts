import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangePassword {
    @Field()
    currentPassword: string;

    @Field()
    newPassword: string;
}
