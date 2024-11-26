import { recipeSchema } from '@app/modules/recipes/models/recipe.model';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    imports: [
        DynamooseModule.forFeature([
            {
                name: 'Recipe',
                schema: recipeSchema,
                options: {
                    tableName: 'recipes',
                },
            },
        ]),
    ],
    providers: [],
})
export class StepsModule {}
