import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { ProductCreatedPublisher } from '@/modules/product/events/publishers/product-created.publisher';
import { ProductUpdatedPublisher } from '@/modules/product/events/publishers/product-updated.publisher';
import { ProductDeletedPublisher } from '@/modules/product/events/publishers/product-deleted.publisher';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { ProductsReservedPublisher } from '@/modules/product/events/publishers/products-reserved.publisher';
import { ProductsReservationFailedPublisher } from '@/modules/product/events/publishers/products-reservation-failed.publisher';
import { CartCheckedOutListener } from '@/modules/product/events/listeners/cart-checked-out.listener';
import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { ListenerRegistrar } from '@/modules/product/events/listener-registrar';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [
  ProductCreatedPublisher,
  ProductUpdatedPublisher,
  ProductDeletedPublisher,
  ProductsReservedPublisher,
  ProductsReservationFailedPublisher,
];

const listeners: (new (...args) => BaseEventListener<IEvent>)[] = [CartCheckedOutListener];

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), MessageBrokerModule],
  controllers: [ProductController],
  providers: [ProductService, ...publishers, ...listeners, ListenerRegistrar],
  exports: [...listeners],
})
export class ProductModule {}
