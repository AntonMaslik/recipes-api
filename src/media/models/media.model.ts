import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const mediaSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  fileName: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  fileType: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MediaModel = dynamoose.model('Media', mediaSchema);
