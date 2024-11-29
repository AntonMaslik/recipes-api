import * as dynamoose from 'dynamoose';

export const rateSchema = new dynamoose.Schema({
    recipeId: {
        type: String,
        hashKey: true,
    },
    userId: {
        type: String,
        rangeKey: true,
    },
    evaluation: {
        type: Number,
        required: true,
    },
});

export interface RateKey {
    recipeId: string;
    userId: string;
}

export interface RateModel extends RateKey {
    evaluation: number;
}
