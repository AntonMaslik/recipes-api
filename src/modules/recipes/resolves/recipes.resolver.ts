import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { Recipe } from '@modules/recipes/object-types/recipes-object-type';
import { RecipesService } from '@modules/recipes/recipes.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Recipes')
export class RecipesResolver {
    constructor(private readonly recipesService: RecipesService) {}

    @Mutation(() => Recipe)
    async createRecipe(createRecipeDto: CreateRecipeDTO): Promise<Recipe> {
        return this.recipesService.createRecipe(createRecipeDto);
    }

    @Mutation(() => Recipe)
    async updateRecipe(
        @Args('id', { type: () => String }) id: string,
        updateRecipeDto: UpdateRecipeDTO,
    ): Promise<Recipe> {
        return this.recipesService.updateRecipe(id, updateRecipeDto);
    }

    @Mutation(() => Recipe)
    async deleteRecipeById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<Recipe> {
        return this.recipesService.deleteRecipeById(id);
    }
}
