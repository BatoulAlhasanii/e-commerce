import { AppFactory } from './factories/app';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { CartCheckedOutListener } from '@/modules/product/events/listeners/cart-checked-out.listener';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';
import { ICartCheckedOut } from '@/modules/message-broker/interfaces/cart-checked-out.interface';
import { faker } from '@faker-js/faker';

describe('CartCheckedOutListener', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  let messageBroker: IMessageBroker;
  let cartCheckedOutListener: CartCheckedOutListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    messageBroker = app.instance.get(MESSAGE_BROKER);

    cartCheckedOutListener = app.instance.get(CartCheckedOutListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests products reservation failure', async () => {
    const availableProducts: Product[] = await Factory.createMany(productRepository, productDefinition, 3, {
      stock: 3,
    });

    const unAvailableProduct: Product = await Factory.create(productRepository, productDefinition, {
      stock: 3,
      deletedAt: new Date(),
    });

    const data: ICartCheckedOut['data'] = {
      userId: faker.string.uuid(),
      items: [
        {
          productId: availableProducts[0].id,
          quantity: availableProducts[0].stock - 1,
        },
        {
          productId: availableProducts[1].id,
          quantity: availableProducts[1].stock,
        },
        {
          productId: availableProducts[2].id,
          quantity: availableProducts[2].stock + 1,
        },
        {
          productId: unAvailableProduct.id,
          quantity: unAvailableProduct.stock,
        },
        {
          productId: faker.string.uuid(),
          quantity: 1,
        },
      ],
    };

    await cartCheckedOutListener.handle(data);

    const publisher: jest.Mock = messageBroker.publish as jest.Mock;

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(publisher.mock.calls[0][0]).toBe(Subjects.ProductsReservationFailed);
    expect(publisher.mock.calls[0][1]).toMatchObject({
      itemAvailabilityGroups: {
        notFoundItems: [data.items[4]],
        unAvailableItems: [data.items[3]],
        insufficientQuantityItems: [{ ...data.items[2], availableQuantity: availableProducts[2].stock }],
        availableItems: [data.items[0], data.items[1]],
      },
      userId: data.userId,
    });

    const products: Product[] = await productRepository.find();

    expect(products[0].stock).toEqual(3);
    expect(products[0].reservedQuantity).toEqual(0);
    expect(products[1].stock).toEqual(3);
    expect(products[1].reservedQuantity).toEqual(0);
    expect(products[2].stock).toEqual(3);
    expect(products[2].reservedQuantity).toEqual(0);
  });

  it('tests reserving products successfully', async () => {
    const availableProducts: Product[] = await Factory.createMany(productRepository, productDefinition, 3, {
      stock: 3,
    });

    const data: ICartCheckedOut['data'] = {
      userId: faker.string.uuid(),
      items: [
        {
          productId: availableProducts[0].id,
          quantity: 1,
        },
        {
          productId: availableProducts[1].id,
          quantity: 2,
        },
        {
          productId: availableProducts[2].id,
          quantity: 3,
        },
      ],
    };

    await cartCheckedOutListener.handle(data);

    const publisher: jest.Mock = messageBroker.publish as jest.Mock;

    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(publisher.mock.calls[0][0]).toBe(Subjects.ProductsReserved);
    expect(publisher.mock.calls[0][1]).toMatchObject({
      userId: data.userId,
      items: [data.items[0], data.items[1], data.items[2]],
    });

    const products: Product[] = await productRepository.find();

    expect(products[0].stock).toEqual(2);
    expect(products[0].reservedQuantity).toEqual(1);
    expect(products[1].stock).toEqual(1);
    expect(products[1].reservedQuantity).toEqual(2);
    expect(products[2].stock).toEqual(0);
    expect(products[2].reservedQuantity).toEqual(3);
  });
});
