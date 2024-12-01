import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from 'nestjs-minio-client';
import internal from 'stream';

@Injectable()
export class MediaService {
    constructor(private readonly minioService: MinioService) {}

    async getResource(
        bucketName: string,
        id: string,
        res: Response,
    ): Promise<void> {
        try {
            const objectStream: internal.Readable =
                await this.minioService.client.getObject(bucketName, id);

            res.setHeader('ContentType', 'application/octet-stream');
            objectStream.pipe(res);
        } catch (error) {
            res.status(505).send(error);
        }
    }
}
