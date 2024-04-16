import {Process, Processor} from "@nestjs/bull";
import {
    OrderExpirationTimeReachedPublisher
} from "@/modules/order/events/publishers/order-expiration-time-reached.publisher";
import { Job } from 'bull';

export const ORDER_EXPIRATION_QUEUE: string = 'order_expiration';

@Processor(ORDER_EXPIRATION_QUEUE)
export class OrderExpirationProcessor {

    constructor(private readonly orderExpirationTimeReachedPublisher: OrderExpirationTimeReachedPublisher) {
    }
    @Process()
    async publishOrderExpirationTimeReachedEvent(job: Job): Promise<void> {
        await this.orderExpirationTimeReachedPublisher.publish({ orderId: job.data.orderId });
    }
}