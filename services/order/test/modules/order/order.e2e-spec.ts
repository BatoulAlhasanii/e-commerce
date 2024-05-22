import * as request from 'supertest';
import { Factory } from '@/database/factories/factory';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthUserPayload } from '@/modules/auth/types';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { AppFactory } from '../../factories/app';
import { Order } from '@/modules/order/entities/order.entity';
import { orderDefinition } from '@/database/factories/order.factory';

describe('OrderController (e2e)', () => {
  const endpoint: string = '/orders';
  let app: AppFactory;
  let orderRepository: OrderRepository;
  const user: AuthUserPayload = {
    id: faker.string.uuid(),
    role: UserRole.SELLER,
  };
  let token: string;
  let messageBroker: IMessageBroker;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

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

  it('tests get user orders successfully', async () => {
    const orders: Order[] = await Factory.createMany(orderRepository, orderDefinition, 3, {
      userId: user.id,
    });

    const response = await request(app.instance.getHttpServer()).get(`${endpoint}`).expect(200);

    expect(response.body.data.length).toEqual(3);
    expect(response.body.data[0].total).toEqual(orders[0].total);
  });

  it('tests get user order successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition, {
      userId: user.id,
    });

    const response = await request(app.instance.getHttpServer()).get(`${endpoint}/${order.id}`).expect(200);

    expect(response.body.data.total).toEqual(order.total);
  });
});
