import * as dynamose from 'dynamoose';

export const recipeSchema = new dynamose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: crypto.randomUUID(),
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

export interface RecipeKey {
    id?: string;
}

export interface RecipeModel extends RecipeKey {
    title?: string;
    body?: string;
    ingriditens?: string[];
    servingSize?: number;
    cookingTime?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: Date;
}
