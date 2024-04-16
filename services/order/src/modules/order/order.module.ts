import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { OrderItemRepository } from '@/modules/order/repositories/order-item.repository';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { ProductsReservedListener } from '@/modules/order/events/listeneres/products-reserved.listener';
import { ListenerRegistrar } from '@/modules/order/events/listener-registrar';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { OrderCreatedPublisher } from '@/modules/order/events/publishers/order-created.publisher';
import { ProductRepository } from '@/modules/product/repositories/product.repository';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [OrderCreatedPublisher];

const listeners: (new (...args) => BaseEventListener<IEvent>)[] = [ProductsReservedListener];

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository, OrderItemRepository, ProductRepository]), MessageBrokerModule],
  providers: [...publishers, ...listeners, ListenerRegistrar],
})
export class OrderModule {}