import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Sets up global pipes for the application, applying validation logic across all routes.
   *
   * @param {ValidationPipe} ValidationPipe - A class that provides validation and transformation logic for incoming requests.
   *
   * - `transform: true`: Automatically transforms incoming payloads to the corresponding DTO instances.
   * - `whitelist: true`: Strips out properties that are not defined with decorators in the DTO.
   * - `forbidNonWhitelisted: true`: Throws an error if the request contains properties that are not specified in the DTO.
   */

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
