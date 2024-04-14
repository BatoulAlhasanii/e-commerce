import { Repository } from 'typeorm';
import { EntityRepository } from '@/database/typeorm/typeorm-entity-repository.decorator';
import { OrderItem } from '@/modules/order/entities/order-item.entity';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {}
