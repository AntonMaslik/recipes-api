import { MediaController } from '@app/modules/media/controllers/media.controller';
import { MediaService } from '@app/modules/media/media.service';
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [MediaService],
    exports: [MediaService],
    imports: [
        MinioModule.register({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '',
            secretKey: '',
        }),
    ],
    controllers: [MediaController],
})
export class MediaModule {}
