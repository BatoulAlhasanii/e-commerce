import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { config } from '@/config';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([]),
  ],
  providers: [],
})
export class SeederModule {}
