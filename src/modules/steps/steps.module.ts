import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { StepsService } from '@app/modules/steps/steps.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [StepsService],
    exports: [StepsService],
    imports: [RecipesRepository],
})
export class StepsModule {}
