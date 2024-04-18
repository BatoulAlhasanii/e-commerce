import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserPayload } from '@/modules/auth/types';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { StripeService } from '@/modules/payment/stripe.service';
import { PaymentDonePublisher } from '@/modules/payment/events/publishers/payment-done.publisher';
import { PaymentIntentStatus } from '@/modules/message-broker/enums/payment-intent-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly stripeService: StripeService,
    private readonly paymentDonePublisher: PaymentDonePublisher,
  ) {}

  async getPaymentByOrder(orderId: string, user: AuthUserPayload) {
    const order: Order | null = await this.orderRepository.findOneByOrFail({ id: orderId });

    if (order.userId != user.id) {
      throw new HttpException('You are not allowed to get the payment', HttpStatus.UNAUTHORIZED);
    }

    if (order.status != OrderStatus.Pending) {
      throw new HttpException('Payment cannot be done for current order', HttpStatus.BAD_REQUEST);
    }

    return await this.paymentRepository.findOneBy({ orderId: order.id });
  }

  async confirmPayment(orderId: string, user: AuthUserPayload) {
    const order: Order | null = await this.orderRepository.findOneByOrFail({ id: orderId });

    if (order.userId != user.id) {
      throw new HttpException('You are not allowed to confirm the payment', HttpStatus.UNAUTHORIZED);
    }

    if (order.status == OrderStatus.Paid) {
      throw new HttpException('Payment is already confirmed', HttpStatus.BAD_REQUEST);
    }

    const payment: Payment = await this.paymentRepository.findOneBy({ orderId: order.id });

    const paymentIntent = await this.stripeService.retrievePaymentIntent(payment.stripeId);

    if (paymentIntent.status === PaymentIntentStatus.Succeeded) {
      await this.paymentDonePublisher.publish({ orderId: order.id });

      return { paymentHasSucceeded: true };
    }

    return { paymentHasSucceeded: false };
  }
}
