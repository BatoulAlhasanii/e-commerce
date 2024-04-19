import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

export interface IOrderExpirationTimeReached {
  subject: Subjects.OrderExpirationTimeReached;
  data: {
    orderId: string;
  };
}
