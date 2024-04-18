import { EntitySerializer } from '@/utils/entity-serializer';
import { Payment } from '@/modules/payment/entities/payment.entity';

export class PaymentSerializer extends EntitySerializer<Payment> {
  id: string;
  orderId: string;
  stripeId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Payment) {
    super();
    this.id = entity.id;
    this.orderId = entity.orderId;
    this.stripeId = entity.stripeId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
