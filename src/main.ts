import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

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

  // Load your swagger.json file
  const swaggerDocument = JSON.parse(fs.readFileSync('swagger.json', 'utf-8'));

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(3001);
}
bootstrap();
