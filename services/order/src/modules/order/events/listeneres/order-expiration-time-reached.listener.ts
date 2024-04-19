import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IOrderExpirationTimeReached } from '@/modules/message-broker/interfaces/order-expiration-time-reached.interface';
import { Injectable } from '@nestjs/common';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { OrderUpdatedPublisher } from '@/modules/order/events/publishers/order-updated.publisher';

@Injectable()
export class OrderExpirationTimeReachedListener extends BaseEventListener<IOrderExpirationTimeReached> {
  subject: Subjects.OrderExpirationTimeReached = Subjects.OrderExpirationTimeReached;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderUpdatedPublisher: OrderUpdatedPublisher,
  ) {
    super();
  }

  async handle(data: IOrderExpirationTimeReached['data']): Promise<void> {
    let order: Order | null = await this.orderRepository.findOneBy({ id: data.orderId });

    if (!order) {
      throw new Error('Order does not exist');
    }

    if (order.status == OrderStatus.Paid) {
      return;
    }

    await this.orderRepository.update(order.id, { status: OrderStatus.Canceled });

    order = await this.orderRepository.findOneBy({ id: order.id });

    //TODO: send items
    await this.orderUpdatedPublisher.publish({
      id: order.id,
      status: order.status,
      version: order.version,
    });
  }
}