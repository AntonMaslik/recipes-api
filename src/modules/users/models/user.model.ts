import { Field, ObjectType } from '@nestjs/graphql';
import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

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

const userSchema = new dynamose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

export const UserModel = dynamose.model('User', userSchema);
