import { NestFactory } from '@nestjs/core';
import { SeederModule } from '@/database/seeder/seeder.module';
import { UserSeeder } from '@/database/seeder/user.seeder';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then(async (appContext) => {
      await appContext.get(UserSeeder).seed();

      await appContext.close();
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
