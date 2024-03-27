import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IProductDeleted } from '@/modules/message-broker/interfaces/product-deleted.interface';

export class ProductDeletedPublisher extends BaseEventPublisher<IProductDeleted> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
}
