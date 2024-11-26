import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeModel } from '@modules/recipes/models/recipe.model';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import { Injectable } from '@nestjs/common';
import { QueryResponse, ScanResponse } from 'nestjs-dynamoose';

@Injectable()
export class RecipesService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    async createRecipe(createRecipeDto: CreateRecipeDTO): Promise<RecipeModel> {
        return this.recipesRepository.create(createRecipeDto);
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
}
