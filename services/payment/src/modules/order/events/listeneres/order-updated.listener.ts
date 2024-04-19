import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Injectable } from '@nestjs/common';
import {OrderRepository} from "@/modules/order/repositories/order.repository";
import {Order} from "@/modules/order/entities/order.entity";
import {IOrderUpdated} from "@/modules/message-broker/interfaces/order-updated.interface";

@Injectable()
export class OrderUpdatedListener extends BaseEventListener<IOrderUpdated> {
    subject: Subjects.OrderUpdated = Subjects.OrderUpdated;

    constructor(private readonly orderRepository: OrderRepository) {
        super();
    }

    async handle(data: IOrderUpdated['data']): Promise<void> {
        const order: Order | null = await this.orderRepository.findOneBy({
            id: data.id,
            version: data.version - 1,
        });

        if (!order) {
            throw new Error('Order not found');
        }

        await this.orderRepository.update(order.id, {
            status: order.status,
        });
    }
}
