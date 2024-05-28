import { Inject, OnModuleInit } from '@nestjs/common';
import { CartCheckedOutListener } from '@/modules/product/events/listeners/cart-checked-out.listener';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import {OrderUpdatedListener} from "@/modules/product/events/listeners/order-updated.listener";

export class ListenerRegistrar implements OnModuleInit {
  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: IMessageBroker,
    private readonly cartCheckedOutListener: CartCheckedOutListener,
    private readonly orderUpdatedListener: OrderUpdatedListener,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.messageBroker.registerListener(this.cartCheckedOutListener);
    await this.messageBroker.registerListener(this.orderUpdatedListener);
  }
}
