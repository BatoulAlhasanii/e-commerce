import { AppFactory } from '../../../factories/app';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { faker } from '@faker-js/faker';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductUpdatedListener } from '@/modules/product/events/listeneres/product-updated.listener';
import { productDefinition } from '@/database/factories/product.factory';
import { Factory } from '@/database/factories/factory';
import { IProductUpdated } from '@/modules/message-broker/interfaces/product-updated.interface';

describe('ProductUpdatedListener', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  let productUpdatedListener: ProductUpdatedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    productUpdatedListener = app.instance.get(ProductUpdatedListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests update product successfully', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition);

    const data: IProductUpdated['data'] = {
      id: product.id,
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
      version: product.version + 1,
    };

    await productUpdatedListener.handle(data);

    const storedProduct: Product = await productRepository.findOneBy({
      id: product.id,
    });

    expect(storedProduct.name).toBe(data.name);
    expect(storedProduct.price).toEqual(data.price);
    expect(storedProduct.version).toEqual(2);
  });
});
