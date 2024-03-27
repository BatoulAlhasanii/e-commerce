import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IProductUpdated } from '@/modules/message-broker/interfaces/product-updated.interface';

export class ProductUpdatedPublisher extends BaseEventPublisher<IProductUpdated> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
