import { dynamooseScheme } from '@app/config/db.schema';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { StepsImageController } from '@app/modules/steps/controllers/step-image.controller';
import { StepsResolver } from '@app/modules/steps/resolves/steps.resolver';
import { StepsService } from '@app/modules/steps/steps.service';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MinioModule } from 'nestjs-minio-client';

@Module({
    providers: [StepsService, RecipesRepository, StepsResolver],
    exports: [StepsService],
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
    controllers: [StepsImageController],
})
export class StepsModule {}
