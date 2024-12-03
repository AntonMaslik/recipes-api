import { ConfigService } from '@nestjs/config';

export const getDynamooseConfig = (configService: ConfigService) => ({
    local: configService.getOrThrow<string>('DYNAMOOSE_LOCAL'),
    aws: {
        accessKeyId: configService.getOrThrow<string>(
            'DYNAMOOSE_ACCESS_KEY_ID',
            'your-access-key',
        ),
        secretAccessKey: configService.getOrThrow<string>(
            'DYNAMOOSE_SECRET_ACCESS_KEY',
            'your-secret-key',
        ),
        region: configService.getOrThrow<string>(
            'DYNAMOOSE_REGION',
            'us-east-1',
        ),
    },
});
