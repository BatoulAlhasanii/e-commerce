import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IProductsReservationFailed } from '@/modules/message-broker/interfaces/products-reservation-failed.interface';

export class ProductsReservationFailedPublisher extends BaseEventPublisher<IProductsReservationFailed> {
  subject: Subjects.ProductsReservationFailed = Subjects.ProductsReservationFailed;
}
