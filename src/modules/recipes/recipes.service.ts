import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeModel } from '@modules/recipes/models/recipe.model';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { QueryResponse, ScanResponse } from 'nestjs-dynamoose';
import { MinioService } from 'nestjs-minio-client';
import * as url from 'url';

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
        const recipe: RecipeModel = await this.recipesRepository.findByName(
            createRecipeDto.name,
        );

        if (recipe) {
            throw new ConflictException('This recipe already exists!');
        }

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
    ): Promise<ScanResponse<RecipeModel>> {
        const start: number = (page - 1) * limit;

        const recipes: ScanResponse<RecipeModel> =
            await this.recipesRepository.findByLimit(limit, start);

        if (recipes.length <= 0) {
            return null;
        }

        return recipes;
    }

    async searchRecipes(
        query: string,
        page: number,
        limit: number,
    ): Promise<QueryResponse<RecipeModel>> {
        const start: number = (page - 1) * limit;

        return this.recipesRepository.findByLimitAndQuery(query, limit, start);
    }

    async bindImage(id: string, file: Express.Multer.File): Promise<string> {
        const recipe: RecipeModel = await this.recipesRepository.findById(id);

        if (!recipe) {
            throw new NotFoundException('Recipe not find!');
        }

        const bucketName: string = 'recipe-images';
        const objectName: string = `${crypto.randomUUID()}`;

        const urlPath: string = `${this.configService.getOrThrow<string>('MINIO_ENDPOINT')}:${this.configService.getOrThrow<string>('MINIO_PORT')}/${bucketName}/${objectName}`;

        try {
            await this.minioService.client.bucketExists(bucketName);

            await this.minioService.client.putObject(
                bucketName,
                objectName,
                file.buffer,
            );

            delete recipe.id;
            delete recipe.image;

            await this.recipesRepository.update(id, {
                image: urlPath,
                ...recipe,
            });
        } catch (error) {
            return error;
        }

        return urlPath;
    }

    async unbindImage(id: string): Promise<boolean> {
        const recipe: RecipeModel = await this.getRecipeById(id);

        if (!recipe) {
            throw new NotFoundException('Recipe not find!');
        }

        const parsedUrl: url.UrlWithStringQuery = url.parse(recipe.image);

        const bucketName: string = parsedUrl.pathname?.split('/')[1];
        const objectName: string = parsedUrl.pathname
            ?.split('/')
            .slice(2)
            .join('/');

        try {
            await this.minioService.client.removeObject(bucketName, objectName);

            delete recipe.id;
            delete recipe.image;

            await this.updateRecipe(id, { image: '', ...recipe });
        } catch (error) {
            return error;
        }

        return true;
    }
}
