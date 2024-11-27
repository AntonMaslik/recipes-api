import { RecipeModel, Step } from '@app/modules/recipes/models/recipe.model';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { CreateStepDTO } from '@app/modules/steps/dto/create-step.dto';
import { UpdateStepDTO } from '@app/modules/steps/dto/update-step.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StepsService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    async getStepsRecipe(recipeId: string): Promise<Step[]> {
        return this.recipesRepository.getStepsRecept(recipeId);
    }

    async createStep(
        recipeId: string,
        createStepDto: CreateStepDTO,
    ): Promise<RecipeModel> {
        return this.recipesRepository.createStep(recipeId, createStepDto);
    }

    async updateStep(
        recipeId: string,
        id: string,
        updateStepDto: UpdateStepDTO,
    ): Promise<RecipeModel> {
        return this.recipesRepository.updateStep(recipeId, id, {
            ...updateStepDto,
            id,
        });
    }

    async deleteStep(recipeId: string, id: string): Promise<RecipeModel> {
        return this.recipesRepository.deleteStep(recipeId, id);
    }

    async updatePosition(
        recipeId: string,
        id: string,
        position: number,
    ): Promise<RecipeModel> {
        return this.recipesRepository.updatePosition(recipeId, id, position);
    }
}
