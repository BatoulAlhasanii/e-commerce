import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { OrderCreatedListener } from '@/modules/order/events/listeneres/order-created.listener';
import { ListenerRegistrar } from '@/modules/order/events/listener-registrar';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { PaymentModule } from '@/modules/payment/payment.module';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [];

const listeners: (new (...args) => BaseEventListener<IEvent>)[] = [OrderCreatedListener];

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, PaymentRepository]),
    MessageBrokerModule,
    PaymentModule
  ],
  providers: [...publishers, ...listeners, ListenerRegistrar],
})
export class OrderModule {}
