import { RateKey, RateModel } from '@app/modules/rate/models/rate.model';
import { RecipeModel } from '@app/modules/recipes/models/recipe.model';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, Model, ScanResponse } from 'nestjs-dynamoose';

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
        const recipes: ScanResponse<RecipeModel> =
            await this.recipesRepository.findNonDeleted();

        const ratedItems: ScanResponse<RateModel> = await this.rateModel
            .scan()
            .exec();

        if (ratedItems.length == 0 || recipes.length == 0) {
            this.logger.log(`[INFO] Recipes or ratedItems not find!`);

            return;
        }

        // O(n * m) - не очень хорошо, можно быстрее (Anton)
        for (const recipe of recipes) {
            let sumRatingForRecept: number = 0;
            let countReceptItem: number = 0;

            for (const rateItem of ratedItems) {
                if (rateItem.recipeId == recipe.id) {
                    sumRatingForRecept += rateItem.evaluation;
                    countReceptItem += 1;
                }
            }

            const avg: number = sumRatingForRecept / countReceptItem;

            await this.recipesRepository.update(recipe.id, {
                rating: avg,
            });

            await this.logger.log(
                `Recept id: ${recipe.id}, his rating: ${avg}`,
                'INFO',
            );
        }
    }
}
