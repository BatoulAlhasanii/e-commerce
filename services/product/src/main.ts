import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@/exception/validation.exception';

async function bootstrap() {
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  await app.listen(3000);
}
bootstrap();

function validateEnvVariables() {
  const requiredEnvVariables: string[] = [
    'NODE_ENV',
    'DB_TYPE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_KEY',
    'JWT_TTL',
  ];

  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      console.error(`${envVar} must be defined`);
      process.exit(1);
    }
  }
}
