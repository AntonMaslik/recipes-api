import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const tokenSchema = new dynamose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  refreshToken: {
    type: String,
  },
  userId: {
    type: String,
    index: { name: 'userIdIndex' },
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

export interface TokenKey {
  id?: string;
  refreshToken?: string;
}

export interface TokenModel extends TokenKey {
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
