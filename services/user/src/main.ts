import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

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
  ];

  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      console.error(`${envVar} must be defined`);
      process.exit(1);
    }
  }
}
