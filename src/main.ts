import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
