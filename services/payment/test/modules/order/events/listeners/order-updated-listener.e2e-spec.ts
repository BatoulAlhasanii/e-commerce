import { faker } from '@faker-js/faker';
import { Factory } from '@/database/factories/factory';
import {OrderRepository} from "@/modules/order/repositories/order.repository";
import {OrderUpdatedListener} from "@/modules/order/events/listeneres/order-updated.listener";
import {orderDefinition} from "@/database/factories/order.factory";
import {Order} from "@/modules/order/entities/order.entity";
import {OrderStatus} from "@/modules/order/enums/order-status.enum";
import {IOrderUpdated} from "@/modules/message-broker/interfaces/order-updated.interface";
import {AppFactory} from "../../../../factories/app";

describe('OrderUpdatedListener', () => {
  let app: AppFactory;
  let orderRepository: OrderRepository;
  let orderUpdatedListener: OrderUpdatedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    orderRepository = app.instance.get(OrderRepository);

    orderUpdatedListener = app.instance.get(OrderUpdatedListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests updating order successfully', async () => {
    const order: Order = await Factory.create(orderRepository, orderDefinition);

    const data: IOrderUpdated['data'] = {
      id: order.id,
      status: faker.helpers.arrayElement([OrderStatus.Canceled, OrderStatus.Paid]),
      items: [{ productId: faker.string.uuid(), quantity: faker.number.int({ min: 1, max: 3 }) }],
      version: order.version + 1,
    };

    await orderUpdatedListener.handle(data);

    const storedOrder: Order = await orderRepository.findOneBy({
      id: order.id,
    });

    expect(storedOrder.status).toBe(data.status);
    expect(storedOrder.version).toEqual(2);
  });
});
