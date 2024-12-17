import * as crypto from 'crypto';
import * as dynamose from 'dynamoose';

export const tokenSchema = new dynamose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: crypto.randomUUID(),
    },
    refreshToken: {
        type: String,
    },
    userId: {
        type: String,
        index: { name: 'userIdIndex' },
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

export interface TokenKey {
    id?: string;
    refreshToken?: string;
}

export interface TokenModel extends TokenKey {
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
