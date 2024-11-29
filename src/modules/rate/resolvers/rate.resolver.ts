import { AccessGuard } from '@app/decorators/guard.decorators';
import { User } from '@app/decorators/user.decorator';
import { Rate } from '@app/modules/rate/object-types/rate-object-type';
import { RateService } from '@app/modules/rate/rate.service';
import { UserModel } from '@app/modules/users/models/user.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Rate')
export class RateResolver {
    constructor(private readonly rateService: RateService) {}

    @AccessGuard()
    @Mutation(() => Rate)
    async createEvaluation(
        @Args('recipeId', { type: () => String }) recipeId: string,
        @Args('evaluation', { type: () => Number }) evaluation: number,
        @User() user: UserModel,
    ) {
        console.log(user);
        return this.rateService.createEvaluation(recipeId, user.id, evaluation);
    }
}
