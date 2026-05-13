import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig  = new DocumentBuilder()
    .setTitle('Shop API')
    .setDescription('Product & Order API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig );
  SwaggerModule.setup('api', app, document);


   const configService = app.get(ConfigService);

  const port = configService.get<number>('port') ?? 3000;

  await app.listen(port);

  //  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
