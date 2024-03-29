import { Module } from '@nestjs/common';
import { CartController } from '@/modules/cart/cart.controller';
import { CartService } from '@/modules/cart/cart.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [CartService],
})
export class CartModule {}
