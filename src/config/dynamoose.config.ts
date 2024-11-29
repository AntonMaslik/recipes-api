export const dynamooseConfig = {
    local: process.env.DYNAMOOSE_LOCAL === 'true',
    aws: {
        accessKeyId: process.env.DYNAMOOSE_ACCESS_KEY_ID || 'your-access-key',
        secretAccessKey:
            process.env.DYNAMOOSE_SECRET_ACCESS_KEY || 'your-secret-key',
        region: process.env.DYNAMOOSE_REGION || 'us-east-1',
    },
};
