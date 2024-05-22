import { EntitySerializer } from '@/utils/entity-serializer';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { OrderSerializer } from '@/modules/order/serializers/order.serializer';

export class OrderItemSerializer extends EntitySerializer<OrderItem> {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
  order: Order;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: OrderItem) {
    super();
    this.id = entity.id;
    this.productId = entity.productId;
    this.quantity = entity.quantity;
    this.price = entity.price;
    this.orderId = entity.orderId;
    this.order = entity.order ? OrderSerializer.transform(entity.order) : undefined;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
