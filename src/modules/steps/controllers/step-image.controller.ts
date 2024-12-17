import { AccessGuard } from '@app/decorators/guard.decorators';
import { StepsService } from '@app/modules/steps/steps.service';
import {
    BadRequestException,
    Controller,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@AccessGuard()
@Controller('steps')
export class StepsImageController {
    constructor(private readonly stepsService: StepsService) {}

    @Post('bind-image/:id')
    @UseInterceptors(FileInterceptor('image'))
    async bindImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('File not find!');
        }

        return this.stepsService.bindImage(id, file);
    }

    @Post('unbind-image/:id')
    async unbindImage(@Param('id') id: string): Promise<boolean> {
        return this.stepsService.unbindImage(id);
    }
}
