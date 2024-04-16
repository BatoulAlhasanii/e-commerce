import { Module } from '@nestjs/common';
import {MessageBrokerModule} from "@/modules/message-broker/message-broker.module";
import {BullModule} from "@nestjs/bull";
import {ORDER_EXPIRATION_QUEUE} from "@/modules/order/processors/order-expiration.processor";
import {BaseEventPublisher} from "@/modules/message-broker/events/publishers/base-event.publisher";
import {IEvent} from "@/modules/message-broker/interfaces/event.interface";
import {
    OrderExpirationTimeReachedPublisher
} from "@/modules/order/events/publishers/order-expiration-time-reached.publisher";
import {BaseEventListener} from "@/modules/message-broker/events/listeners/base-event.listener";
import {OrderCreatedListener} from "@/modules/order/events/listeners/order-created.listener";
import {ListenerRegistrar} from "@/modules/order/events/listener-registrar";

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [OrderExpirationTimeReachedPublisher];

const listeners: (new (...args) => BaseEventListener<IEvent>)[] = [OrderCreatedListener];

@Module({
    imports: [
        MessageBrokerModule,
        BullModule.registerQueue({
            name: ORDER_EXPIRATION_QUEUE
        })
    ],
    providers: [...publishers, ...listeners, ListenerRegistrar]
})
export class OrderModule {}
