import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    MessageBrokerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
