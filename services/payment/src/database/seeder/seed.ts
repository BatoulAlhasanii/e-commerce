import { NestFactory } from '@nestjs/core';
import { SeederModule } from '@/database/seeder/seeder.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then(async (appContext) => {
      await appContext.close();
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
