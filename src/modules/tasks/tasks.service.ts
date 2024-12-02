import { RateKey, RateModel } from '@app/modules/rate/models/rate.model';
import {
    RecipeKey,
    RecipeModel,
} from '@app/modules/recipes/models/recipe.model';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, Model, ScanResponse } from 'nestjs-dynamoose';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectModel('Recipe')
        private readonly recipeModel: Model<RecipeModel, RecipeKey>,

        @InjectModel('Rate')
        private readonly rateModel: Model<RateModel, RateKey>,
    ) {}

    @Cron(CronExpression.EVERY_2_HOURS)
    async handleCron() {
        for await (const recipes of this.getRecipesGenerator()) {
            for (const recipe of recipes) {
                const average: number = await this.averageRating(
                    100,
                    recipe.id,
                );
                await this.recipeModel.update(recipe, {
                    rating: average,
                });
            }
        }
    }

    async averageRating(
        limitRating: number = 100,
        recipeId: string,
    ): Promise<number> {
        let sum: number = 0;
        let amount: number = 0;

        for await (const ratings of this.getRatingGenerator(
            limitRating,
            recipeId,
        ) as AsyncGenerator<RateModel[]>) {
            sum += ratings.reduce((acc, { evaluation }) => evaluation + acc, 0);
            amount += ratings.length;
        }

        if (amount === 0) {
            return 0;
        }

        return sum / amount;
    }

    async *getRecipesGenerator(
        limit: number = 100,
    ): AsyncGenerator<RecipeModel[]> {
        let lastKey: object | null = null;

        do {
            const recipes: ScanResponse<RecipeModel> = await this.recipeModel
                .scan()
                .where('deletedAt')
                .not()
                .exists()
                .startAt(lastKey)
                .limit(limit)
                .exec();

            lastKey = recipes.lastKey;

            yield recipes;
        } while (lastKey);
    }

    async *getRatingGenerator(
        limit: number = 100,
        recipeId: string,
    ): AsyncGenerator {
        let lastKey: object | null = null;

        do {
            const ratings: ScanResponse<RateModel> = await this.rateModel
                .scan()
                .where('recipeId')
                .eq(recipeId)
                .startAt(lastKey)
                .limit(limit)
                .exec();

            lastKey = ratings.lastKey;

            yield ratings;
        } while (lastKey);
    }
}
