import { Inject, OnModuleInit } from '@nestjs/common';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { OrderCreatedListener } from '@/modules/order/events/listeneres/order-created.listener';

export class ListenerRegistrar implements OnModuleInit {
  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: IMessageBroker,
    private readonly orderCreatedListener: OrderCreatedListener,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.messageBroker.registerListener(this.orderCreatedListener);
  }
}
