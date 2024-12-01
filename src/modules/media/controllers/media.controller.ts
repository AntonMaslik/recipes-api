import { AccessGuard } from '@app/decorators/guard.decorators';
import { MediaService } from '@app/modules/media/media.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@AccessGuard()
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(':id')
    async getMedia(
        @Param('id') id: string,
        @Param('bucketName') bucketName: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.mediaService.getResource(bucketName, id, res);
    }
}
