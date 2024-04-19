import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IPaymentDone {
  subject: Subjects.PaymentDone;
  data: {
    orderId: string;
  };
}
