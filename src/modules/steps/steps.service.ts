import { Step } from '@app/modules/recipes/models/recipe.model';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { CreateStepDTO } from '@app/modules/steps/dto/create-step.dto';
import { UpdateStepDTO } from '@app/modules/steps/dto/update-step.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as url from 'url';

@Injectable()
export class StepsService {
    constructor(
        private readonly recipesRepository: RecipesRepository,

        private readonly minioService: MinioService,

        private readonly configService: ConfigService,
    ) {}

    async getStepsRecipe(recipeId: string): Promise<Step[]> {
        return this.recipesRepository.getStepsRecept(recipeId);
    }

    async createStep(
        recipeId: string,
        createStepDto: CreateStepDTO,
    ): Promise<Step> {
        return this.recipesRepository.createStep(recipeId, createStepDto);
    }

    async updateStep(id: string, updateStepDto: UpdateStepDTO): Promise<Step> {
        return this.recipesRepository.updateStep(id, {
            ...updateStepDto,
        });
    }

    async deleteStep(id: string): Promise<Step> {
        return this.recipesRepository.deleteStep(id);
    }

    async updatePosition(id: string, position: number): Promise<Step> {
        return this.recipesRepository.updatePositionStep(id, position);
    }

    async bindImage(id: string, file: Express.Multer.File): Promise<string> {
        const bucketName: string = 'step-images';
        const objectName: string = crypto.randomUUID();

        const urlPath: string = `${this.configService.getOrThrow<string>('MINIO_ENDPOINT')}:${this.configService.getOrThrow<string>('MINIO_PORT')}/${bucketName}/${objectName}`;

        try {
            await this.minioService.client.bucketExists(bucketName);

            await this.minioService.client.putObject(
                bucketName,
                objectName,
                file.buffer,
            );

            await this.updateStep(id, {
                media: urlPath,
            });
        } catch (error) {
            return error;
        }

        return urlPath;
    }

    async unbindImage(id: string): Promise<boolean> {
        const step: Step = await this.recipesRepository.getStepById(id);

        if (!step) {
            throw new NotFoundException('Step not found!');
        }

        const parsedUrl: url.UrlWithStringQuery = url.parse(step.media);

        const bucketName: string = parsedUrl.pathname?.split('/')[1];
        const objectName: string = parsedUrl.pathname
            ?.split('/')
            .slice(2)
            .join('/');

        try {
            await this.minioService.client.removeObject(bucketName, objectName);

            await this.updateStep(id, { media: '' });
        } catch (error) {
            return error;
        }

        return true;
    }
}
