import { dynamooseScheme } from '@app/config/db.schema';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import { RecipesService } from '@modules/recipes/recipes.service';
import { RecipesResolver } from '@modules/recipes/resolves/recipes.resolver';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    providers: [RecipesResolver, RecipesService, RecipesRepository],
    exports: [RecipesService],
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
})
export class RecipesModule {}
