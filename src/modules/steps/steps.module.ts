import { dynamooseScheme } from '@app/config/db.schema';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { StepsResolver } from '@app/modules/steps/resolves/steps.resolver';
import { StepsService } from '@app/modules/steps/steps.service';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    providers: [StepsService, RecipesRepository, StepsResolver],
    exports: [StepsService],
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
})
export class StepsModule {}
