import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const stepSchema = new dynamose.Schema({
  uuid: {
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
});

export const stepModel = dynamose.model('Step', stepSchema);
