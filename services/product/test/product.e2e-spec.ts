import * as request from 'supertest';
import { AppFactory } from './factories/app';
import { ProductRepository } from '@/product/repositories/product.repository';
import { Product } from '@/product/entities/product.entity';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthUserPayload } from '@/auth/types';
import { UserRole } from '@/auth/enums/user-role.enum';

describe('ProductController (e2e)', () => {
  let app: AppFactory;
  let productRepository: ProductRepository;
  const user: AuthUserPayload = {
    id: faker.string.uuid(),
    role: UserRole.SELLER,
  };
  let token: string;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

    const jwtService: JwtService = app.instance.get(JwtService);

    token = jwtService.sign(user);
  });

  afterEach(async () => {
    await app.cleanupDB();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests get all products successfully', async () => {
    const products: Product[] = await Factory.createMany(
      productRepository,
      productDefinition,
      3,
    );

    const response = await request(app.instance.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body.data.length).toEqual(3);
    expect(response.body.data[0].name).toEqual(products[0].name);
  });

  it('tests create product successfully', async () => {
    const { userId, ...product } = productDefinition();

    await request(app.instance.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .expect(201);

    const storedProduct: Product = await productRepository.findOneBy({
      name: product.name,
    });

    expect(storedProduct.stock).toEqual(product.stock);
    expect(storedProduct.price).toEqual(product.price);
  });

  it('tests get product successfully', async () => {
    const product: Product = await Factory.create(
      productRepository,
      productDefinition,
    );

    const response = await request(app.instance.getHttpServer())
      .get(`/products/${product.id}`)
      .expect(200);

    expect(response.body.data.name).toEqual(product.name);
    expect(response.body.data.stock).toEqual(product.stock);
    expect(response.body.data.price).toEqual(product.price);
  });

  it('tests update product successfully', async () => {
    const product: Product = await Factory.create(
      productRepository,
      productDefinition,
      { userId: user.id },
    );

    const payload = { name: faker.commerce.productName() };

    await request(app.instance.getHttpServer())
      .put(`/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    const storedProduct: Product = await productRepository.findOneBy({
      id: product.id,
    });

    expect(storedProduct.name).toEqual(payload.name);
    expect(storedProduct.stock).toEqual(product.stock);
    expect(storedProduct.price).toEqual(product.price);
  });

  it('tests delete product successfully', async () => {
    const product: Product = await Factory.create(
      productRepository,
      productDefinition,
      { userId: user.id },
    );

    await request(app.instance.getHttpServer())
      .delete(`/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const storedProduct: Product = await productRepository.findOneBy({
      id: product.id,
    });

    expect(storedProduct).toBeNull();
  });
});
