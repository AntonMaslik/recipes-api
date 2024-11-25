import { dynamooseScheme } from '@app/config/db.schema';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { RecipesService } from './recipes.service';
import { RecipesResolver } from './resolves/recipes.resolver';

@Module({
    providers: [RecipesResolver, RecipesService],
    exports: [RecipesService],
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
})
export class RecipesModule {}
