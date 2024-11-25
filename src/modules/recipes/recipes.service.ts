import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeModel } from '@modules/recipes/models/recipe.model';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import { Injectable } from '@nestjs/common';

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
        return this.recipesRepository.update(updateRecipesDto);
    }

    async deleteRecipeById(id: string): Promise<RecipeModel> {
        return this.recipesRepository.softDelete(id);
    }

    async getRecipeById(id: string): Promise<RecipeModel> {
        return this.recipesRepository.findById(id);
    }
}
