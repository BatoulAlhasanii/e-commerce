import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { ListenerRegistrar } from '@/modules/product/events/listener-registrar';
import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';
import { ProductCreatedListener } from '@/modules/product/events/listeneres/product-created.listener';
import { ProductUpdatedListener } from '@/modules/product/events/listeneres/product-updated.listener';
import { ProductDeletedListener } from '@/modules/product/events/listeneres/product-deleted.listener';

const listeners: (new (...args) => BaseEventListener<IEvent>)[] = [ProductCreatedListener, ProductUpdatedListener, ProductDeletedListener];

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), MessageBrokerModule],
  providers: [...listeners, ListenerRegistrar],
})
export class ProductModule {}
