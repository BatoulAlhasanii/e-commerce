import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { ICartCheckedOut } from '@/modules/message-broker/interfaces/cart-checked-out.interface';

export class CartCheckedOutPublisher extends BaseEventPublisher<ICartCheckedOut> {
  subject: Subjects.CartCheckedOut = Subjects.CartCheckedOut;
}
