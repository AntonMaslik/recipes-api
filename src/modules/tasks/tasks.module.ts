import { dynamooseScheme } from '@app/config/db.schema';
import { RecipesRepository } from '@app/modules/recipes/models/recipes.repository';
import { TasksService } from '@app/modules/tasks/tasks.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    providers: [TasksService, RecipesRepository],
    imports: [
        DynamooseModule.forFeature(dynamooseScheme),
        ScheduleModule.forRoot(),
    ],
})
export class TasksModule {}
