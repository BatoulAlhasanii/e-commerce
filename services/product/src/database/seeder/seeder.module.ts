import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { config } from '@/config';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { ProductRepository } from '@/product/repositories/product.repository';
import { ProductSeeder } from '@/database/seeder/product.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProductRepository]),
  ],
  providers: [ProductSeeder],
})
export class SeederModule {}
