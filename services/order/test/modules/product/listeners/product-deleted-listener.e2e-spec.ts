import { AppFactory } from '../../../factories/app';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductDeletedListener } from '@/modules/product/events/listeneres/product-deleted.listener';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { IProductDeleted } from '@/modules/message-broker/interfaces/product-deleted.interface';

describe('ProductDeletedListener', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  let productDeletedListener: ProductDeletedListener;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    productDeletedListener = app.instance.get(ProductDeletedListener);
  });

  afterEach(async () => {
    await app.cleanupDB();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests Delete product successfully', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition);

    const data: IProductDeleted['data'] = {
      id: product.id,
      version: product.version + 1,
    };

    await productDeletedListener.handle(data);

    const storedProduct: Product = await productRepository.findOne({
      where: { id: data.id },
      withDeleted: true,
    });

    expect(storedProduct.deletedAt).toBeDefined();
  });
});
