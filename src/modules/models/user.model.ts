import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new dynamose.Schema({
  uuid: {
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

export const userModel = dynamose.model('User', userSchema);
