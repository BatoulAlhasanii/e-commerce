import { IProductsReserved } from '@/modules/message-broker/interfaces/products-reserved.interface';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export class ProductsReservedPublisher extends BaseEventPublisher<IProductsReserved> {
  subject: Subjects.ProductsReserved = Subjects.ProductsReserved;
}
