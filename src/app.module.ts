import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { dynamooseConfig } from '@app/config/dynamoose.config';
import { getMinioConfig } from '@app/config/minio.config';
import { MediaModule } from '@app/modules/media/media.module';
import { StepsModule } from '@app/modules/steps/steps.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { UsersModule } from '@modules/users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MinioModule } from 'nestjs-minio-client';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            context: ({ req, res }) => {
                const cookies = req.cookies;

                return {
                    req,
                    res,
                    user: req.user,
                    cookies,
                };
            },
        }),
        DynamooseModule.forRootAsync({
            useFactory: async () => ({
                local: dynamooseConfig.local,
                aws: dynamooseConfig.aws,
            }),
        }),
        MinioModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                getMinioConfig(configService),
            inject: [ConfigService],
        }),
        MulterModule.register({
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
        UsersModule,
        AuthModule,
        RecipesModule,
        StepsModule,
        MediaModule,
    ],
})
export class AppModule {}
