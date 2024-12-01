import { getMinioConfig } from '@app/config/minio.config';
import { MediaController } from '@app/modules/media/controllers/media.controller';
import { MediaService } from '@app/modules/media/media.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [MediaService],
    exports: [MediaService],
    imports: [
        MinioModule.registerAsync({
            useFactory: getMinioConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [MediaController],
})
export class MediaModule {}
