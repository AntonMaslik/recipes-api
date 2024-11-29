import { dynamooseScheme } from '@app/config/db.schema';
import { RateService } from '@app/modules/rate/rate.service';
import { RateResolver } from '@app/modules/rate/resolvers/rate.resolver';
import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
    providers: [RateService, RateResolver],
    exports: [RateService],
    imports: [DynamooseModule.forFeature(dynamooseScheme)],
})
export class RateModule {}
