import { RateKey, RateModel } from '@app/modules/rate/models/rate.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

@Injectable()
export class RateService {
    constructor(
        @InjectModel('Rate')
        private readonly rateModel: Model<RateModel, RateKey>,
    ) {}

    async createEvaluation(
        recipeId: string,
        userId: string,
        evaluation: number,
    ): Promise<RateModel> {
        const existingRate = await this.rateModel
            .query('recipeId')
            .eq(recipeId)
            .where('userId')
            .eq(userId)
            .exec();

        if (existingRate && existingRate.length > 0) {
            throw new ConflictException('Evaluation already exists!');
        }

        return this.rateModel.create({
            recipeId,
            userId,
            evaluation,
        });
    }
}
