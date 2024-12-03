import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeModel } from '@modules/recipes/models/recipe.model';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { QueryResponse, ScanResponse } from 'nestjs-dynamoose';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class RecipesService {
    constructor(
        private readonly recipesRepository: RecipesRepository,
        private readonly minioService: MinioService,
        private readonly configService: ConfigService,
    ) {}

    async createRecipe(
        userId: string,
        createRecipeDto: CreateRecipeDTO,
    ): Promise<RecipeModel> {
        return this.recipesRepository.create({
            ...createRecipeDto,
            userId,
        });
    }

    async updateRecipe(
        id: string,
        updateRecipesDto: UpdateRecipeDTO,
    ): Promise<RecipeModel> {
        return this.recipesRepository.update(id, updateRecipesDto);
    }

    async deleteRecipeById(id: string): Promise<RecipeModel> {
        return this.recipesRepository.softDelete(id);
    }

    async getRecipeById(id: string): Promise<RecipeModel> {
        return this.recipesRepository.findById(id);
    }

    async getPaginatedRecipes(
        page: number,
        limit: number,
    ): Promise<RecipeModel[]> {
        const start: number = Math.max(page - 1, 0) * limit;

        const recipes: ScanResponse<RecipeModel> =
            await this.recipesRepository.findByLimit(limit, start);

        if (recipes.length <= 0) {
            return [];
        }

        return recipes;
    }

    async searchRecipes(
        query: string,
        page: number,
        limit: number,
    ): Promise<QueryResponse<RecipeModel>> {
        const start: number = Math.max(page - 1, 0) * limit;

        return this.recipesRepository.findByLimitAndQuery(query, limit, start);
    }

    async bindImage(id: string, file: Express.Multer.File): Promise<string> {
        const recipe: RecipeModel = await this.recipesRepository.findById(id);

        if (!recipe) {
            throw new NotFoundException('Recipe not find!');
        }

        const bucketName: string = this.configService.getOrThrow<string>(
            'MINIO_BUCKET_RECIPES',
        );
        const objectName: string = crypto.randomUUID();

        try {
            await this.minioService.client.bucketExists(bucketName);

            await this.minioService.client.putObject(
                bucketName,
                objectName,
                file.buffer,
            );

            await this.recipesRepository.update(id, {
                image: objectName,
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return objectName;
    }

    async unbindImage(id: string): Promise<boolean> {
        const recipe: RecipeModel = await this.getRecipeById(id);

        if (!recipe) {
            throw new NotFoundException('Recipe not find!');
        }

        const bucketName: string = this.configService.getOrThrow<string>(
            'MINIO_BUCKET_RECIPES',
        );

        try {
            await this.minioService.client.removeObject(
                bucketName,
                recipe.image,
            );

            await this.updateRecipe(id, { image: '' });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return true;
    }
}
