import { AppFactory } from '../../../factories/app';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { ProductCreatedListener } from '@/modules/product/events/listeneres/product-created.listener';
import { IProductCreated } from '@/modules/message-broker/interfaces/product-created.interface';
import { faker } from '@faker-js/faker';
import { Product } from '@/modules/product/entities/product.entity';

describe('ProductCreatedListener', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  let productCreatedListener: ProductCreatedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    productCreatedListener = app.instance.get(ProductCreatedListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests create product successfully', async () => {
    const data: IProductCreated['data'] = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
    };

    await productCreatedListener.handle(data);

    const product: Product = await productRepository.findOneBy({ id: data.id });

    expect(product.id).toBe(data.id);
    expect(product.name).toBe(data.name);
    expect(product.price).toEqual(data.price);
  });
});
