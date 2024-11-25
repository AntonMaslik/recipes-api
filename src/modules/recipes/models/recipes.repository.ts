import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { RecipeKey, RecipeModel } from '@modules/recipes/models/recipe.model';
import {
    InjectModel,
    Model,
    QueryResponse,
    ScanResponse,
} from 'nestjs-dynamoose';

import { UpdateRecipeDTO } from '../dto/update-recipe.dto';

export class RecipesRepository {
    @InjectModel('Recipe')
    private readonly recipeModel: Model<RecipeModel, RecipeKey>;

    async softDelete(id: string): Promise<RecipeModel> {
        const now: Date = new Date();

        return this.recipeModel.update(
            { id },
            {
                deletedAt: now,
            },
        );
    }

    async findNonDeleted(): Promise<ScanResponse<RecipeModel>> {
        const recipes: ScanResponse<RecipeModel> = await this.recipeModel
            .scan()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        return recipes;
    }

    async findById(id: string): Promise<RecipeModel> {
        const recipes: QueryResponse<RecipeModel> = await this.recipeModel
            .query('id')
            .eq(id)
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length <= 0) {
            return null;
        }

        return recipes[0];
    }

    async create(createRecipeDto: CreateRecipeDTO): Promise<RecipeModel> {
        return this.recipeModel.create(createRecipeDto);
    }

    async update(updateRecipeDto: UpdateRecipeDTO): Promise<RecipeModel> {
        return this.recipeModel.update(updateRecipeDto);
    }
}
