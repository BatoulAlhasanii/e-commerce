import * as request from 'supertest';
import { Factory } from '@/database/factories/factory';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthUserPayload } from '@/modules/auth/types';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { AppFactory } from '../../factories/app';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { PaymentRepository } from '@/modules/payment/repositories/payment.repository';
import { orderDefinition } from '@/database/factories/order.factory';
import { Order } from '@/modules/order/entities/order.entity';
import { paymentDefinition } from '@/database/factories/payment.factory';
import { Payment } from '@/modules/payment/entities/payment.entity';

describe('PaymentController (e2e)', () => {
  const endpoint: string = '/payments';
  let app: AppFactory;
  let orderRepository: OrderRepository;
  let paymentRepository: PaymentRepository;
  const user: AuthUserPayload = {
    id: faker.string.uuid(),
    role: UserRole.BUYER,
  };
  let token: string;
  let messageBroker: IMessageBroker;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

    paymentRepository = app.instance.get(PaymentRepository);

    const jwtService: JwtService = app.instance.get(JwtService);

    token = jwtService.sign(user);

    messageBroker = app.instance.get(MESSAGE_BROKER);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests get payment successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition, { userId: user.id });

    const payment: Payment = await Factory.create(paymentRepository, paymentDefinition, { orderId: order.id });

    const response = await request(app.instance.getHttpServer()).set('Authorization', `Bearer ${token}`).get(`${endpoint}/order/${order.id}`).expect(200);

    expect(response.body.data.stripeId).toEqual(payment.stripeId);
  });

  it('tests confirm payment successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition, { userId: user.id });

    const payment: Payment = await Factory.create(paymentRepository, paymentDefinition, { orderId: order.id });

    await request(app.instance.getHttpServer()).post(`${endpoint}/confirm/order/${order.id}`).set('Authorization', `Bearer ${token}`).send({}).expect(200);

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(messageBroker.publish).toHaveBeenCalledWith(Subjects.PaymentDone, {
      orderId: payment.orderId,
    });
  });
});
