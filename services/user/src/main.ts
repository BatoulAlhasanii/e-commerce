import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@/exception/validation.exception';

async function bootstrap() {
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
