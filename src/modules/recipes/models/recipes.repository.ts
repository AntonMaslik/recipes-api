import { CreateStepDTO } from '@app/modules/steps/dto/create-step.dto';
import { CreateRecipeDTO } from '@modules/recipes/dto/create-recipe.dto';
import { UpdateRecipeDTO } from '@modules/recipes/dto/update-recipe.dto';
import {
    RecipeKey,
    RecipeModel,
    Step,
} from '@modules/recipes/models/recipe.model';
import { NotFoundException } from '@nestjs/common';
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
        return this.recipeModel.update(
            { id },
            {
                deletedAt: new Date(),
            },
        );
    }

    async findNonDeleted(): Promise<ScanResponse<RecipeModel>> {
        return this.recipeModel.scan().where('deletedAt').not().exists().exec();
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

    async findByName(name: string): Promise<RecipeModel> {
        const recipes: QueryResponse<RecipeModel> = await this.recipeModel
            .query('name')
            .eq(name)
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length <= 0) {
            throw new NotFoundException('Recipes not find!');
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
        return this.recipeModel
            .scan()
            .limit(limit)
            .startAt({
                value: start,
            })
            .exec();
    }

    async findByLimitAndQuery(
        query: string,
        limit: number,
        start: number,
    ): Promise<QueryResponse<RecipeModel>> {
        return this.recipeModel
            .query('nameIndex')
            .contains(query)
            .limit(limit)
            .startAt({
                value: start,
            })
            .exec();
    }

    async createStep(id: string, createStepDTO: CreateStepDTO): Promise<Step> {
        const recipe: RecipeModel = await this.findById(id);

        if (!recipe) {
            throw new NotFoundException('Recipe not found')!;
        }

        recipe.steps = [];

        recipe.steps.push({ ...createStepDTO, id: crypto.randomUUID() });

        await this.recipeModel.update(recipe);

        return recipe.steps.at(-1);
    }

    async deleteStep(id: string): Promise<Step> {
        const recipes: RecipeModel[] = await this.recipeModel
            .scan('steps.id')
            .eq(id)
            .and()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length === 0) {
            throw new Error('Step not found in any recipe!');
        }

        const recipe: RecipeModel = recipes[0];

        const stepIndex: number = recipe.steps.findIndex(
            (step) => step.id === id,
        );

        if (stepIndex === -1) {
            throw new Error('Step not found in recipe');
        }

        const [deletedStep] = recipe.steps.splice(stepIndex, 1);

        await this.recipeModel.update(recipe);

        return deletedStep;
    }

    async updateStep(id: string, updatedStepData: Step): Promise<Step> {
        const recipes: RecipeModel[] = await this.recipeModel
            .scan('steps.id')
            .eq(id)
            .and()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length === 0) {
            throw new Error('Step not found in any recipe!');
        }

        const recipe: RecipeModel = recipes[0];

        const stepIndex: number = recipe.steps.findIndex(
            (step) => step.id === id,
        );

        if (stepIndex === -1) {
            throw new Error('Step not found in recipe');
        }

        recipe.steps[stepIndex] = updatedStepData;

        return this.recipeModel.update(recipe);
    }

    async updatePositionStep(id: string, position: number): Promise<Step> {
        const recipes: RecipeModel[] = await this.recipeModel
            .scan('steps.id')
            .eq(id)
            .and()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length === 0) {
            throw new Error('Step not found in any recipe!');
        }

        const recipe: RecipeModel = recipes[0];

        const stepIndex: number = recipe.steps.findIndex(
            (step) => step.id === id,
        );

        if (stepIndex === -1) {
            throw new Error('Step not found in recipe');
        }

        recipe.steps[stepIndex].position = position;

        return this.recipeModel.update(recipe);
    }

    async getStepByIdFromRecept(recipeId: string, id: string): Promise<Step> {
        const recipe: RecipeModel = await this.findById(recipeId);

        const stepsFromRecipe: Step[] = recipe.steps;

        return stepsFromRecipe.find((step) => step.id === id);
    }

    async getStepById(id: string): Promise<Step> {
        const recipes: RecipeModel[] = await this.recipeModel
            .scan('steps.id')
            .eq(id)
            .and()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (recipes.length === 0) {
            throw new Error('Step not found in any recipe!');
        }

        const recipe: RecipeModel = recipes[0];

        const stepIndex: number = recipe.steps.findIndex(
            (step) => step.id === id,
        );

        if (stepIndex === -1) {
            throw new Error('Step not found in recipe');
        }

        return recipe.steps[stepIndex];
    }

    async getStepsRecept(recipeId: string): Promise<Step[]> {
        const recipe: RecipeModel = await this.findById(recipeId);

        if (recipe.steps.length <= 0) {
            throw new NotFoundException('Steps not find in this recipe!');
        }

        return recipe.steps;
    }
}
