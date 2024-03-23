import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@/exception/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
