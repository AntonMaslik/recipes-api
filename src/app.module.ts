import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DynamooseModule } from 'nestjs-dynamoose';
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
            aws: { region: 'fake-west-1' },
        }),
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
