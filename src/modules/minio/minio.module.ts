import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    imports: [
        MinioModule.register({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '',
            secretKey: '',
        }),
    ],
})
export class MinioIntegraionModule {}
