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
import { PaymentDoneListener } from '@/modules/order/events/listeneres/payment-done.listener';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { IOrderItem } from '@/modules/message-broker/interfaces/order-updated.interface';
import { OrderItemRepository } from '@/modules/order/repositories/order-item.repository';
import { orderItemDefinition } from '@/database/factories/order-item.factory';

describe('PaymentDoneListener', () => {
  let app: AppFactory;
  let orderRepository: OrderRepository;
  let messageBroker: IMessageBroker;
  let paymentDoneListener: PaymentDoneListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

    paymentDoneListener = app.instance.get(PaymentDoneListener);

    messageBroker = app.instance.get(MESSAGE_BROKER);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests updating order successfully when payment is done successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition);

    const orderItems: OrderItem[] = await Factory.create(OrderItemRepository, orderItemDefinition, { orderId: order.id });

    const data: IOrderExpirationTimeReached['data'] = {
      orderId: order.id,
    };

    await paymentDoneListener.handle(data);

    const storedOrder: Order = await orderRepository.findOneBy({
      id: order.id,
    });

    expect(storedOrder.status).toBe(OrderStatus.Paid);
    expect(storedOrder.version).toEqual(2);

    const publisher: jest.Mock = messageBroker.publish as jest.Mock;

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(publisher.mock.calls[0][0]).toBe(Subjects.PaymentDone);
    expect(publisher.mock.calls[0][1]).toMatchObject({
      id: storedOrder.id,
      status: storedOrder.status,
      items: orderItems.map((item: OrderItem): IOrderItem => ({ productId: item.productId, quantity: item.quantity })),
      version: storedOrder.version,
    });
  });
});
