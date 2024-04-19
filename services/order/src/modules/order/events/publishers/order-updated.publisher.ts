import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IOrderUpdated } from '@/modules/message-broker/interfaces/order-updated.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export class OrderUpdatedPublisher extends BaseEventPublisher<IOrderUpdated> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
