import { getMinioConfig } from '@app/config/minio.config';
import { MediaController } from '@app/modules/media/controllers/media.controller';
import { MediaService } from '@app/modules/media/media.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [MediaService],
    exports: [MediaService],
    imports: [
        MinioModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                getMinioConfig(configService),
            inject: [ConfigService],
        }),
    ],
    controllers: [MediaController],
})
export class MediaModule {}
