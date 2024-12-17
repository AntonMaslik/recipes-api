import { AccessGuard } from '@app/decorators/guard.decorators';
import { RecipesService } from '@app/modules/recipes/recipes.service';
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
@Controller('recipes')
export class RecipesImageController {
    constructor(private readonly recipesService: RecipesService) {}

    @Post('bind-image/:id')
    @UseInterceptors(FileInterceptor('image'))
    async bindImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('File not find!');
        }

        return this.recipesService.bindImage(id, file);
    }

    @Post('unbind-image/:id')
    async unbindImage(@Param('id') id: string): Promise<boolean> {
        return this.recipesService.unbindImage(id);
    }
}
