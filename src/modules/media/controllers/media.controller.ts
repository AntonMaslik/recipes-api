import { MediaService } from '@app/modules/media/media.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(':id')
    async getMedia(
        @Param('id') id: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.mediaService.getResource(id, res);
    }
}