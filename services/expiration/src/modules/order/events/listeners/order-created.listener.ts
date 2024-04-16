import {BaseEventListener} from "@/modules/message-broker/events/listeners/base-event.listener";
import {IOrderCreated} from "@/modules/message-broker/interfaces/order-created.interface";
import {Subjects} from "@/modules/message-broker/enums/subjects.enum";
import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import { Queue } from 'bull';
import {ORDER_EXPIRATION_QUEUE} from "@/modules/order/processors/order-expiration.processor";

@Injectable()
export class OrderCreatedListener extends BaseEventListener<IOrderCreated> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;


    constructor(@InjectQueue(ORDER_EXPIRATION_QUEUE) private orderExpirationQueue: Queue) {
        super();
    }

    async handle(data: IOrderCreated["data"]): Promise<void> {
        const expiration: Date = new Date(data.createdAt);
        expiration.setSeconds(expiration.getSeconds() + 20 * 60);

        const delay: number = expiration.getTime() - new Date().getTime();

        await this.orderExpirationQueue.add({
            orderId: data.id,
        }, {
            delay: delay > 0 ? delay : 0,
        });
    }
}