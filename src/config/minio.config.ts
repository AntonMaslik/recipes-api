import { ConfigService } from '@nestjs/config';

export const getMinioConfig = (configService: ConfigService) => ({
    endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT', 'localhost'),
    port: parseInt(configService.getOrThrow<string>('MINIO_PORT', '9000'), 10),
    useSSL:
        configService.getOrThrow<string>('MINIO_USE_SSL', 'false') === 'true',
    accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY', 'minio'),
    secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY', 'minio123'),
});
