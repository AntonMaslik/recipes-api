import { RateKey, RateModel } from '@app/modules/rate/models/rate.model';
import { RecipeModel } from '@app/modules/recipes/models/recipe.model';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, Model } from 'nestjs-dynamoose';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly recipesRepository: RecipesRepository,

        @InjectModel('Rate')
        private readonly rateModel: Model<RateModel, RateKey>,
    ) {}

    @Cron(CronExpression.EVERY_2_HOURS)
    async handleCron() {
        const recipes: RecipeModel[] =
            await this.recipesRepository.findNonDeleted();
        const ratedItems: RateModel[] = await this.rateModel.scan().exec();

        if (!ratedItems.length || !recipes.length) {
            this.logger.log('[INFO] Recipes or ratedItems not found!');

            return;
        }

        const ratingsMap = ratedItems.reduce(
            (acc, rateItem) => {
                if (!acc[rateItem.recipeId]) {
                    acc[rateItem.recipeId] = [];
                }
                acc[rateItem.recipeId].push(rateItem.evaluation);

                return acc;
            },
            {} as Record<string, number[]>,
        );

        for await (const recipe of this.getRecipeWithAverageRating(
            recipes,
            ratingsMap,
        )) {
            await this.recipesRepository.update(recipe.id, {
                rating: recipe.avgRating,
            });
            await this.logger.log(
                `Recipe id: ${recipe.id}, new rating: ${recipe.avgRating}`,
                'INFO',
            );
        }
    }

    async *getRecipeWithAverageRating(
        recipes: RecipeModel[],
        ratingsMap: Record<string, number[]>,
    ): AsyncGenerator<{ id: string; avgRating: number }> {
        for (const recipe of recipes) {
            const ratings = ratingsMap[recipe.id] || [];
            if (ratings.length > 0) {
                const sumRating = ratings.reduce(
                    (sum, rating) => sum + rating,
                    0,
                );
                const avg = sumRating / ratings.length;
                yield { id: recipe.id, avgRating: avg };
            }
        }
    }
}
