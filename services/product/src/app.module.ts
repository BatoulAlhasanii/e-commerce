import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@/config';
import { DatabaseModule } from '@/database/database.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@/exception/http-exception.filter';
import { ProductModule } from '@/modules/product/product.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    DatabaseModule,
    MessageBrokerModule,
    AuthModule,
    ProductModule,
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
