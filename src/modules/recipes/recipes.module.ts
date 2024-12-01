import { dynamooseScheme } from '@app/config/db.schema';
import { getMinioConfig } from '@app/config/minio.config';
import { RecipesImageController } from '@app/modules/recipes/controllers/recipe-image.controller';
import { RecipesRepository } from '@modules/recipes/models/recipes.repository';
import { RecipesService } from '@modules/recipes/recipes.service';
import { RecipesResolver } from '@modules/recipes/resolves/recipes.resolver';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [RecipesResolver, RecipesService, RecipesRepository],
    exports: [RecipesService],
    imports: [
        DynamooseModule.forFeature(dynamooseScheme),
        MinioModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getMinioConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [RecipesImageController],
})
export class RecipesModule {}
