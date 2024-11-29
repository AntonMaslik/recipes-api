import { ConfigService } from '@nestjs/config';

export const getMinioConfig = (configService: ConfigService) => ({
    endPoint: configService.get<string>('MINIO_ENDPOINT', 'localhost'),
    port: parseInt(configService.get<string>('MINIO_PORT', '9000'), 10),
    useSSL: configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
    accessKey: configService.get<string>('MINIO_ACCESS_KEY', 'minio'),
    secretKey: configService.get<string>('MINIO_SECRET_KEY', 'minio123'),
});
