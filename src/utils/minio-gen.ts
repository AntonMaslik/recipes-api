import { ConfigService } from '@nestjs/config';

export function generateMinioUrl(
    bucketName: string,
    objectName: string,
    configService: ConfigService,
): string {
    const endpoint = configService.getOrThrow<string>('MINIO_ENDPOINT');
    const port = configService.getOrThrow<string>('MINIO_PORT');

    return `${endpoint}:${port}/${bucketName}/${objectName}`;
}
