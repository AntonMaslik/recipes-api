import { AccessGuard } from '@app/decorators/guard.decorators';
import { User } from '@app/decorators/user.decorator';
import { UserModel } from '@app/modules/users/models/user.model';
import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeModel } from '@modules/recipes/models/recipe.model';
import { Recipe } from '@modules/recipes/object-types/recipes-object-type';
import { RecipesService } from '@modules/recipes/recipes.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QueryResponse } from 'nestjs-dynamoose';

@AccessGuard()
@Resolver('Recipes')
export class RecipesResolver {
    constructor(private readonly recipesService: RecipesService) {}

    @AccessGuard()
    @Mutation(() => Recipe)
    async createRecipe(
        @User() user: UserModel,
        @Args('input') createRecipeDto: CreateRecipeDTO,
    ): Promise<Recipe> {
        return this.recipesService.createRecipe(user.id, createRecipeDto);
    }

    @AccessGuard()
    @Mutation(() => Recipe)
    async updateRecipe(
        @Args('id', { type: () => String }) id: string,
        @Args('input') updateRecipeDto: UpdateRecipeDTO,
    ): Promise<Recipe> {
        return this.recipesService.updateRecipe(id, updateRecipeDto);
    }

    @AccessGuard()
    @Mutation(() => Recipe)
    async deleteRecipeById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<Recipe> {
        return this.recipesService.deleteRecipeById(id);
    }

    @AccessGuard()
    @Query(() => Recipe)
    async getRecipeById(
        @Args('id', { type: () => String }) id: string,
    ): Promise<Recipe> {
        return this.recipesService.getRecipeById(id);
    }

    @AccessGuard()
    @Query(() => Recipe)
    async getRecipesPage(
        @Args('page', { type: () => Number }) page: number,
        @Args('limit', { type: () => Number }) limit: number,
    ): Promise<RecipeModel[]> {
        return this.recipesService.getPaginatedRecipes(page, limit);
    }

    @AccessGuard()
    @Query(() => Recipe)
    async getRecipesQuery(
        @Args('query', { type: () => String }) query: string,
        @Args('page', { type: () => Number }) page: number,
        @Args('limit', { type: () => Number }) limit: number,
    ): Promise<QueryResponse<RecipeModel>> {
        return this.recipesService.searchRecipes(query, page, limit);
    }
}
