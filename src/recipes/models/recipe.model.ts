import * as dynamose from 'dynamoose';

const recipeSchema = new dynamose.Schema({
  uuid: {
    type: String,
    hashKey: true,
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
  ingriditens: {
    type: Array,
  },
  servingSize: {
    type: Number,
  },
  cookingTime: {
    type: String,
  },
  steps: {
    type: Object,
    schema: {
      title: String,
      body: String,
      position: Number,
      image: String,
    },
  },
  rating: {
    type: Number,
  },
});

export const recipeModel = dynamose.model('Recipe', recipeSchema);
