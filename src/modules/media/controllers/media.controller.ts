import { AccessGuard } from '@app/decorators/guard.decorators';
import { MediaService } from '@app/modules/media/media.service';
import {
    Controller,
    Get,
    Header,
    Param,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';

@AccessGuard()
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(':bucketName/:id')
    @Header('Content-Type', 'image')
    async getMedia(
        @Param('id') id: string,
        @Param('bucketName') bucketName: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile> {
        return this.mediaService.getResource(bucketName, id, res);
    }
}
