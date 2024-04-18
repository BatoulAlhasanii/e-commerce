import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';
import { PaymentController } from '@/modules/payment/payment.controller';
import { PaymentService } from '@/modules/payment/payment.service';
import { StripeService } from '@/modules/payment/stripe.service';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { PaymentDonePublisher } from '@/modules/payment/events/publishers/payment-done.publisher';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [PaymentDonePublisher];

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRepository, OrderRepository]),
    MessageBrokerModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, ...publishers],
  exports: [StripeService],
})
export class PaymentModule {}
