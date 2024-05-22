import { BaseEventListener } from '@/modules/message-broker/events/listeners/base-event.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { IOrderCreated } from '@/modules/message-broker/interfaces/order-created.interface';
import { StripeService } from '@/modules/payment/stripe.service';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';
import { Order } from '@/modules/order/entities/order.entity';

@Injectable()
export class OrderCreatedListener extends BaseEventListener<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly stripeService: StripeService,
  ) {
    super();
  }

  async handle(data: IOrderCreated['data']): Promise<void> {
    let order: Order = await this.orderRepository.create({
      id: data.id,
      userId: data.userId,
      total: data.total,
      status: data.status,
    });

    order = await this.orderRepository.save(order);

    //TODO: fire order created domain event, and have listener inside payment module to create payment
    const paymentIntent = await this.stripeService.createPaymentIntent(order.total);

    await this.paymentRepository.create({ orderId: order.id, stripeId: paymentIntent.id });

    //TODO: send notification to user through Firebase containing orderId and stripeId
  }
}
