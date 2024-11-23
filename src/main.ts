import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
