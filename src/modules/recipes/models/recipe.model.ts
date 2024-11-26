import * as crypto from 'crypto';
import * as dynamose from 'dynamoose';

const stepSchema = new dynamose.Schema({
    title: String,
    body: String,
    position: Number,
    media: String,
});

export const recipeSchema = new dynamose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: crypto.randomUUID(),
    },
    name: {
        type: String,
        index: {
            name: 'nameIndex',
        },
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
        schema: [String],
    },
    servingSize: {
        type: Number,
    },
    cookingTime: {
        type: String,
    },
    steps: {
        type: Array,
        schema: [stepSchema],
    },
    rating: {
        type: Number,
        default: 0.0,
    },
    userId: {
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

export interface RecipeKey {
    id: string;
}

export interface Step {
    title: string;
    body: string;
    position: number;
    media: string;
}

export interface RecipeModel extends RecipeKey {
    title: string;
    body: string;
    name: string;
    image: string;
    ingriditens: string[];
    steps?: Step[];
    servingSize: number;
    cookingTime: string;
    rating?: number;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: Date;
}
