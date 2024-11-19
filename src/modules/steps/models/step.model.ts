import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const stepSchema = new dynamose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  image: {
    type: String,
  },
  position: {
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

export const stepModel = dynamose.model('Step', stepSchema);
