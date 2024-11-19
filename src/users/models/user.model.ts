import * as dynamose from 'dynamoose';

const userSchema = new dynamose.Schema({
  uuid: {
    type: String,
    hashKey: true,
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
