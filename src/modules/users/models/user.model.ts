import * as crypto from 'crypto';
import * as dynamose from 'dynamoose';

export const userSchema = new dynamose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: crypto.randomUUID(),
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
    roles: {
        type: Array,
        schema: [String],
        required: true,
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

export interface UserKey {
    id?: string;
}

export interface UserModel extends UserKey {
    name?: string;
    email?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: Date;
    roles?: string[];
}
