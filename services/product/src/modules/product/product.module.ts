import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { MessageBrokerModule } from '@/modules/message-broker/message-broker.module';
import { ProductCreatedPublisher } from '@/modules/product/events/publishers/product-created.publisher';
import { ProductUpdatedPublisher } from '@/modules/product/events/publishers/product-updated.publisher';
import { ProductDeletedPublisher } from '@/modules/product/events/publishers/product-deleted.publisher';
import { BaseEventPublisher } from '@/modules/message-broker/events/publishers/base-event.publisher';
import { IEvent } from '@/modules/message-broker/interfaces/event.interface';

const publishers: (new (...args) => BaseEventPublisher<IEvent>)[] = [
  ProductCreatedPublisher,
  ProductUpdatedPublisher,
  ProductDeletedPublisher,
];

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), MessageBrokerModule],
  controllers: [ProductController],
  providers: [ProductService, ...publishers],
})
export class ProductModule {}
