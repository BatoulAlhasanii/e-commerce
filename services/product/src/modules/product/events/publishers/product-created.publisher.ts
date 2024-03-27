import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IProductCreated } from '@/modules/message-broker/interfaces/product-created.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export class ProductCreatedPublisher extends BaseEventPublisher<IProductCreated> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
