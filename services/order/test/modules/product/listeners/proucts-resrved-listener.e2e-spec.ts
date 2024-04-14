import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { faker } from '@faker-js/faker';
import { AppFactory } from '../../../factories/app';
import { ProductsReservedListener } from '@/modules/order/events/listeneres/products-reserved.listener';
import { IProductsReserved } from '@/modules/message-broker/interfaces/products-reserved.interface';
import { OrderRepository } from '@/modules/order/repositories/order.repository';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderStatus } from '@/modules/order/enums/order-status.enum';

describe('ProductsReservedListener', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  let orderRepository: OrderRepository;
  let messageBroker: IMessageBroker;
  let productsReservedListener: ProductsReservedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    orderRepository = app.instance.get(OrderRepository);

    messageBroker = app.instance.get(MESSAGE_BROKER);

    productsReservedListener = app.instance.get(ProductsReservedListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests creating order successfully', async () => {
    const products: Product[] = await Factory.createMany(productRepository, productDefinition, 3);

    console.log('products', products);
    const userId: string = faker.string.uuid();

    const data: IProductsReserved['data'] = {
      userId,
      items: [
        {
          productId: products[0].id,
          quantity: 1,
        },
        {
          productId: products[1].id,
          quantity: 2,
        },
        {
          productId: products[2].id,
          quantity: 3,
        },
      ],
    };

    await productsReservedListener.handle(data);

    expect(await orderRepository.count()).toEqual(1);

    const order: Order = await orderRepository.findOneBy({ userId });

    const publisher: jest.Mock = messageBroker.publish as jest.Mock;

    expect(order.total).toEqual(
      products[0].price * data.items[0].quantity + products[1].price * data.items[1].quantity + products[2].price * data.items[2].quantity,
    );
    expect(order.status).toBe(OrderStatus.Pending);

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(publisher.mock.calls[0][0]).toBe(Subjects.OrderCreated);
    expect(publisher.mock.calls[0][1]).toMatchObject({
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    });
  });
});
