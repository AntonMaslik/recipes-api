import { dynamooseScheme } from '@app/config/db.schema';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    providers: [],
    exports: [],
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
})
export class RecipesModule {}
