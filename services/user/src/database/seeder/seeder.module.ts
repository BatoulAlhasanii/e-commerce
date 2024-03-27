import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { UserSeeder } from '@/database/seeder/user.seeder';
import { config } from '@/config';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UserSeeder],
})
export class SeederModule {}
