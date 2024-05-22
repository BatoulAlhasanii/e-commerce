import { EntitySerializer } from '@/utils/entity-serializer';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { OrderItemSerializer } from '@/modules/order/serializers/order-item.serializer';

export class OrderSerializer extends EntitySerializer<Order> {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Order) {
    super();
    this.id = entity.id;
    this.userId = entity.userId;
    this.total = entity.total;
    this.status = entity.status;
    this.items = entity.items ? OrderItemSerializer.transformMany(entity.items) : undefined;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
