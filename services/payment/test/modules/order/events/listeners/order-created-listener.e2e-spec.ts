import { faker } from '@faker-js/faker';
import { AppFactory } from '../../../../factories/app';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { OrderCreatedListener } from '@/modules/order/events/listeneres/order-created.listener';
import { IOrderCreated } from '@/modules/message-broker/interfaces/order-created.interface';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { Order } from '@/modules/order/entities/order.entity';
import { StripeService } from '@/modules/payment/stripe.service';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';

describe('OrderCreatedListener', () => {
  let app: AppFactory;
  let orderRepository: OrderRepository;
  let paymentRepository: PaymentRepository;
  let orderCreatedListener: OrderCreatedListener;
  let stripeService: StripeService;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

    paymentRepository = app.instance.get(PaymentRepository);

    orderCreatedListener = app.instance.get(OrderCreatedListener);

    stripeService = app.instance.get(StripeService);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests creating order successfully', async () => {
    const data: IOrderCreated['data'] = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      total: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
    };

    await orderCreatedListener.handle(data);

    const order: Order = await orderRepository.findOneBy({ id: data.id });

    expect(order.userId).toBe(data.userId);
    expect(order.total).toEqual(data.total);
    expect(order.status).toEqual(data.status);

    const createPaymentIntent: jest.Mock = stripeService.createPaymentIntent as jest.Mock;

    expect(stripeService.createPaymentIntent).toHaveBeenCalledTimes(1);
    expect(createPaymentIntent.mock.calls[0][0]).toBe(data.total);

    const payment: Payment = await paymentRepository.findOneBy({ orderId: data.id });

    expect(payment.stripeId).toBeDefined();
  });
});
