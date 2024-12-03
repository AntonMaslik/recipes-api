import { dynamooseScheme } from '@app/config/db.schema';
import { getMinioConfig } from '@app/config/minio.config';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { StepsImageController } from '@app/modules/steps/controllers/step-image.controller';
import { StepsResolver } from '@app/modules/steps/resolves/steps.resolver';
import { StepsService } from '@app/modules/steps/steps.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [StepsService, RecipesRepository, StepsResolver],
    exports: [StepsService],
    imports: [
        DynamooseModule.forFeature(dynamooseScheme),
        MinioModule.registerAsync({
            useFactory: getMinioConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [StepsImageController],
})
export class StepsModule {}
