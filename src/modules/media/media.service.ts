import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { BucketItemFromList } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import internal from 'stream';

@Injectable()
export class MediaService {
    constructor(private readonly minioService: MinioService) {}

    async getResource(id: string, res: Response): Promise<void> {
        try {
            const buckets: BucketItemFromList[] =
                await this.minioService.client.listBuckets();

            let found: boolean = false;

            for (const bucket of buckets) {
                const objectStream: internal.Readable =
                    await this.minioService.client.getObject(bucket.name, id);

                res.setHeader('ContentType', 'application/octet-stream');
                objectStream.pipe(res);

                found = true;
                break;
            }

            if (!found) {
                res.status(404).send('Media not found');
            }
        } catch (error) {
            res.status(505).send(error);
        }
    }
}
