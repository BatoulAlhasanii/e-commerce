import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';

export interface IOrderCreated {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
  };
}
