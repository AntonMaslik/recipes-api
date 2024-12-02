import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from 'nestjs-minio-client';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
    constructor(private readonly minioService: MinioService) {}

    async getResource(
        bucketName: string,
        id: string,
        res: Response,
    ): Promise<StreamableFile> {
        try {
            const objectStream: Readable =
                await this.minioService.client.getObject(bucketName, id);

            return new StreamableFile(objectStream);
        } catch (error) {
            res.status(505).send(error);
        }
    }
}
