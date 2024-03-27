import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@/exception/http-exception.filter';
import { AuthModule } from '@/modules/auth/auth.module';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    MessageBrokerModule,
    AuthModule,
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
