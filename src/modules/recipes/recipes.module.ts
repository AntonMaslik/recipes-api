import { dynamooseScheme } from '@app/config/db.schema';
import { RecipesImageController } from '@app/modules/recipes/controllers/recipe-image.controller';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import { RecipesService } from '@modules/recipes/recipes.service';
import { RecipesResolver } from '@modules/recipes/resolves/recipes.resolver';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [RecipesResolver, RecipesService, RecipesRepository],
    exports: [RecipesService],
    imports: [
        DynamooseModule.forFeature(dynamooseScheme),
        MinioModule.register({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '',
            secretKey: '',
        }),
    ],
    controllers: [RecipesImageController],
})
export class RecipesModule {}
