import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';

export interface IOrderUpdated {
  subject: Subjects.OrderUpdated;
  data: {
    id: string;
    status: OrderStatus;
    version: number;
  };
}
