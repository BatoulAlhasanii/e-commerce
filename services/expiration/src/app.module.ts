import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { config } from '@/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import {OrderModule} from "@/modules/order/order.module";
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        }
      }),
      inject: [ConfigService],
    }),
    MessageBrokerModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
