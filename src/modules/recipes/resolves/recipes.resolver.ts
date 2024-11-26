import { AccessGuard } from '@app/decorators/guard.decorators';
import { User } from '@app/decorators/user.decorator';
import { UserModel } from '@app/modules/users/models/user.model';
import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { Recipe } from '@modules/recipes/object-types/recipes-object-type';
import { RecipesService } from '@modules/recipes/recipes.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

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
}
