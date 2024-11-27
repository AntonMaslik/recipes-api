import { CreateStepDTO } from '@app/modules/steps/dto/create-step.dto';
import { UpdateStepDTO } from '@app/modules/steps/dto/update-step.dto';
import { Step } from '@app/modules/steps/object-types/step-object-type';
import { StepsService } from '@app/modules/steps/steps.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Steps')
export class StepsResolver {
    constructor(private readonly stepsService: StepsService) {}

    @Mutation(() => Step)
    async createStep(
        @Args('recipeId', { type: () => String }) recipeId: string,
        @Args('input') createStepDto: CreateStepDTO,
    ): Promise<Step> {
        return this.stepsService.createStep(recipeId, createStepDto);
    }

    @Mutation(() => Step)
    async updateStep(
        @Args('recipeId', { type: () => String }) recipeId: string,
        @Args('id', { type: () => String }) id: string,
        @Args('input') updateStepDTO: UpdateStepDTO,
    ): Promise<Step> {
        return this.stepsService.updateStep(recipeId, id, updateStepDTO);
    }

    @Mutation(() => Step)
    async deleteStep(
        @Args('recipeId', { type: () => String }) recipeId: string,
        @Args('id', { type: () => String }) id: string,
    ): Promise<Step> {
        return this.stepsService.deleteStep(recipeId, id);
    }

    @Mutation(() => Step)
    async updatePosition(
        @Args('recipeId', { type: () => String }) recipeId: string,
        @Args('id', { type: () => String }) id: string,
        @Args('position', { type: () => Number }) position: number,
    ): Promise<Step> {
        return this.stepsService.updatePosition(recipeId, id, position);
    }

    @Query(() => [Step])
    async getStepsRecipe(
        @Args('recipeId', { type: () => String }) recipeId: string,
    ) {
        return this.stepsService.getStepsRecipe(recipeId);
    }
}
