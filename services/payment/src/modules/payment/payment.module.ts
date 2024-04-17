import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import {PaymentRepository} from "@/modules/payment/repositories/payment.repository";

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [];

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRepository]), MessageBrokerModule],
  providers: [...publishers],
})
export class PaymentModule {}
