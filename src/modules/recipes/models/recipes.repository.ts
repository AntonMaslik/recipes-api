import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import { RecipeKey, RecipeModel } from '@modules/recipes/models/recipe.model';
import * as crypto from 'crypto';
import {
    InjectModel,
    Model,
    QueryResponse,
    ScanResponse,
} from 'nestjs-dynamoose';

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
        return this.recipeModel.create({
            ...createRecipeDto,
            id: crypto.randomUUID(),
        });
    }

    async update(
        id: string,
        updateRecipeDto: UpdateRecipeDTO,
    ): Promise<RecipeModel> {
        return this.recipeModel.update({ id }, updateRecipeDto);
    }

    async findByLimit(
        limit: number,
        start: number,
    ): Promise<ScanResponse<RecipeModel>> {
        const recipes: ScanResponse<RecipeModel> = await this.recipeModel
            .scan()
            .limit(limit)
            .startAt({
                value: start,
            })
            .exec();

        return recipes;
    }

    async findByLimitAndQuery(
        query: string,
        limit: number,
        start: number,
    ): Promise<QueryResponse<RecipeModel>> {
        const recipes: QueryResponse<RecipeModel> = await this.recipeModel
            .query('nameIndex')
            .contains(query)
            .limit(limit)
            .startAt({
                value: start,
            })
            .exec();

        return recipes;
    }
}
