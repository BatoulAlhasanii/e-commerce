import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IOrderCreated } from '@/modules/message-broker/interfaces/order-created.interface';
import { Injectable } from '@nestjs/common';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

@Injectable()
export class OrderCreatedPublisher extends BaseEventPublisher<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
