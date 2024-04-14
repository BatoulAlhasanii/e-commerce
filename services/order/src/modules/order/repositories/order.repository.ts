import { Repository } from 'typeorm';
import { EntityRepository } from '@/database/typeorm/typeorm-entity-repository.decorator';
import { Order } from '@/modules/order/entities/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {}
