import * as dynamoose from 'dynamoose';

const mediaSchema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        default: crypto.randomUUID(),
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
