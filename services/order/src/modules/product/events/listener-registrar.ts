import { Inject, OnModuleInit } from '@nestjs/common';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { ProductDeletedListener } from '@/modules/product/events/listeneres/product-deleted.listener';
import { ProductCreatedListener } from '@/modules/product/events/listeneres/product-created.listener';
import { ProductUpdatedListener } from '@/modules/product/events/listeneres/product-updated.listener';

export class ListenerRegistrar implements OnModuleInit {
  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: IMessageBroker,
    private readonly productCreatedListener: ProductCreatedListener,
    private readonly productUpdatedListener: ProductUpdatedListener,
    private readonly productDeletedListener: ProductDeletedListener,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.messageBroker.registerListener(this.productCreatedListener);
    await this.messageBroker.registerListener(this.productUpdatedListener);
    await this.messageBroker.registerListener(this.productDeletedListener);
  }
}
