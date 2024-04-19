import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IPaymentDone } from '@/modules/message-broker/interfaces/payment-done.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { OrderUpdatedPublisher } from '@/modules/order/events/publishers/order-updated.publisher';

export class PaymentDoneListener extends BaseEventListener<IPaymentDone> {
  subject: Subjects.PaymentDone = Subjects.PaymentDone;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderUpdatedPublisher: OrderUpdatedPublisher,
  ) {
    super();
  }

  async handle(data: IPaymentDone['data']): Promise<void> {
    let order: Order | null = await this.orderRepository.findOneBy({ id: data.orderId });

    if (!order) {
      throw new Error('Order does not exist');
    }

    if (order.status == OrderStatus.PaymentTimeout) {
      //publish event to refund payment
      return;
    }

    await this.orderRepository.update(order.id, { status: OrderStatus.Paid });

    order = await this.orderRepository.findOneBy({ id: order.id });

    //TODO: send items
    await this.orderUpdatedPublisher.publish({
      id: order.id,
      status: order.status,
      version: order.version,
    });
  }
}
