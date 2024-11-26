import { Step } from '@app/modules/recipes/models/recipe.model';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StepsService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    async getStepsRecipe(recipeId: number): Promise<Step[]> {}

    async createStep(): Promise<Step> {}

    async updateStep(id: number): Promise<Step> {}

    async deleteStep(id: number): Promise<Step> {}

    async updatePostion(id: number, position: number): Promise<Step> {}
}
