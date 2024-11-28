import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MediaModule } from '@app/modules/media/media.module';
import { StepsModule } from '@app/modules/steps/steps.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { UsersModule } from '@modules/users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
        DynamooseModule.forRoot({
            local: true,
            aws: {
                region: 'us-east-1',
                accessKeyId: 'key',
                secretAccessKey: 'key',
            },
        }),
        MinioModule.register({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '',
            secretKey: '',
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
