import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Injectable } from '@nestjs/common';
import {OrderRepository} from "@/modules/order/repositories/order.repository";
import {IOrderCreated} from "@/modules/message-broker/interfaces/order-created.interface";

@Injectable()
export class OrderCreatedListener extends BaseEventListener<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  constructor(
    private readonly orderRepository: OrderRepository,
  ) {
    super();
  }

  async handle(data: IOrderCreated['data']): Promise<void> {
    let order = await this.orderRepository.create(data);

    order = await this.orderRepository.save(order);
  }
}
