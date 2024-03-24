import { NestFactory } from '@nestjs/core';
import { SeederModule } from '@/database/seeder/seeder.module';
import { ProductSeeder } from '@/database/seeder/product.seeder';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then(async (appContext) => {
      await appContext.get(ProductSeeder).seed();

      await appContext.close();
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
