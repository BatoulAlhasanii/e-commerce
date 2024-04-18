import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IPaymentDone } from '@/modules/message-broker/interfaces/payment-done.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentDonePublisher extends BaseEventPublisher<IPaymentDone> {
  subject: Subjects.PaymentDone = Subjects.PaymentDone;
}
