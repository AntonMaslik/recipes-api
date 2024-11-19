import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const tokenSchema = new dynamose.Schema({
  uuid: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  token: {
    type: String,
  },
  userId: {
    type: Number,
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

export const tokenModel = dynamose.model('Token', tokenSchema);
