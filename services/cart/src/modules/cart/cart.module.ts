import { Module } from '@nestjs/common';
import { CartController } from '@/modules/cart/cart.controller';
import { CartService } from '@/modules/cart/cart.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { CartCheckedOutPublisher } from '@/modules/cart/events/publishers/cart-checked-out.publisher';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [
  CartCheckedOutPublisher,
];

@Module({
  imports: [
    MessageBrokerModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`,
        options: { connectTimeout: 10000 },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CartController],
  providers: [CartService, ...publishers],
})
export class CartModule {}
