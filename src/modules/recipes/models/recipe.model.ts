import * as dynamose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const recipeSchema = new dynamose.Schema({
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

export const recipeModel = dynamose.model('Recipe', recipeSchema);
