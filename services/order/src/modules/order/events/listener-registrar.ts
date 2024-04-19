import { Inject, OnModuleInit } from '@nestjs/common';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { ProductsReservedListener } from '@/modules/order/events/listeneres/products-reserved.listener';
import { OrderExpirationTimeReachedListener } from '@/modules/order/events/listeneres/order-expiration-time-reached.listener';
import { PaymentDoneListener } from '@/modules/order/events/listeneres/payment-done.listener';

export class ListenerRegistrar implements OnModuleInit {
  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: IMessageBroker,
    private readonly productsReservedListener: ProductsReservedListener,
    private readonly orderExpirationTimeReachedListener: OrderExpirationTimeReachedListener,
    private readonly paymentDoneListener: PaymentDoneListener,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.messageBroker.registerListener(this.productsReservedListener);
    await this.messageBroker.registerListener(this.orderExpirationTimeReachedListener);
    await this.messageBroker.registerListener(this.paymentDoneListener);
  }
}
