import { StepsService } from '@app/modules/steps/steps.service';
import { Resolver } from '@nestjs/graphql';

@Resolver('Steps')
export class StepsResolver {
    constructor(private readonly stepsService: StepsService) {}
}
