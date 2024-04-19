import { AppFactory } from '../../../factories/app';
import { Factory } from '@/database/factories/factory';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { OrderExpirationTimeReachedListener } from '@/modules/order/events/listeneres/order-expiration-time-reached.listener';
import { Order } from '@/modules/order/entities/order.entity';
import { IOrderExpirationTimeReached } from '@/modules/message-broker/interfaces/order-expiration-time-reached.interface';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';
import { orderDefinition } from '@/database/factories/order.factory';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';

describe('OrderExpirationTimeReachedListener', () => {
  let app: AppFactory;
  let orderRepository: OrderRepository;
  let messageBroker: IMessageBroker;
  let orderExpirationTimeReachedListener: OrderExpirationTimeReachedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

    orderExpirationTimeReachedListener = app.instance.get(OrderExpirationTimeReachedListener);

    messageBroker = app.instance.get(MESSAGE_BROKER);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests updating order when expiration time is reached successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition);

    const data: IOrderExpirationTimeReached['data'] = {
      orderId: order.id,
    };

    await orderExpirationTimeReachedListener.handle(data);

    const storedOrder: Order = await orderRepository.findOneBy({
      id: order.id,
    });

    expect(storedOrder.status).toBe(OrderStatus.PaymentTimeout);
    expect(storedOrder.version).toEqual(2);

    const publisher: jest.Mock = messageBroker.publish as jest.Mock;

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(publisher.mock.calls[0][0]).toBe(Subjects.OrderUpdated);
    expect(publisher.mock.calls[0][1]).toMatchObject({
      id: storedOrder.id,
      status: storedOrder.status,
      version: storedOrder.version,
    });
  });
});
