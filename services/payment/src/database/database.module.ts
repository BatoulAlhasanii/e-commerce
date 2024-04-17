import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeOrmConfig from '@/database/typeorm/typeorm.config-migrations';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
