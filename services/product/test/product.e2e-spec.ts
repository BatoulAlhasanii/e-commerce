import * as request from 'supertest';
import { AppFactory } from './factories/app';
import { ProductRepository } from '@/modules/product/repositories/product.repository';
import { Product } from '@/modules/product/entities/product.entity';
import { Factory } from '@/database/factories/factory';
import { productDefinition } from '@/database/factories/product.factory';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthUserPayload } from '@/modules/auth/types';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import { IMessageBroker, MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { Subjects } from '@/modules/message-broker/enums/subjects.enum';

describe('ProductController (e2e)', () => {
  const endpoint: string = '/products';
  let app: AppFactory;
  let productRepository: ProductRepository;
  const user: AuthUserPayload = {
    id: faker.string.uuid(),
    role: UserRole.SELLER,
  };
  let token: string;
  let messageBroker: IMessageBroker;

  beforeAll(async () => {
    app = await AppFactory.new();

    productRepository = app.instance.get(ProductRepository);

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

  it('tests get all products successfully', async () => {
    const products: Product[] = await Factory.createMany(productRepository, productDefinition, 3);

    const response = await request(app.instance.getHttpServer()).get(`${endpoint}`).expect(200);

    expect(response.body.data.length).toEqual(3);
    expect(response.body.data[0].name).toEqual(products[0].name);
  });

  it('tests create product successfully', async () => {
    const { userId, ...product } = productDefinition();

    await request(app.instance.getHttpServer()).post(`${endpoint}`).set('Authorization', `Bearer ${token}`).send(product).expect(201);

    const storedProduct: Product = await productRepository.findOneBy({
      name: product.name,
    });

    expect(storedProduct.stock).toEqual(product.stock);
    expect(storedProduct.price).toEqual(product.price);
    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(messageBroker.publish).toHaveBeenCalledWith(Subjects.ProductCreated, {
      id: storedProduct.id,
      name: storedProduct.name,
      price: storedProduct.price,
      version: storedProduct.version,
    });
  });

  it('tests get product successfully', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition);

    const response = await request(app.instance.getHttpServer()).get(`${endpoint}/${product.id}`).expect(200);

    expect(response.body.data.name).toEqual(product.name);
    expect(response.body.data.stock).toEqual(product.stock);
    expect(response.body.data.price).toEqual(product.price);
  });

  it('tests update product successfully', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition, { userId: user.id });

    const payload = { name: faker.commerce.productName() };

    await request(app.instance.getHttpServer()).put(`${endpoint}/${product.id}`).set('Authorization', `Bearer ${token}`).send(payload).expect(200);

    const storedProduct: Product = await productRepository.findOneBy({
      id: product.id,
    });

    expect(storedProduct.name).toEqual(payload.name);
    expect(storedProduct.stock).toEqual(product.stock);
    expect(storedProduct.price).toEqual(product.price);
    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(messageBroker.publish).toHaveBeenCalledWith(Subjects.ProductUpdated, {
      id: storedProduct.id,
      name: storedProduct.name,
      price: storedProduct.price,
      version: storedProduct.version,
    });
  });

  it('tests delete product successfully', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition, { userId: user.id });

    await request(app.instance.getHttpServer()).delete(`${endpoint}/${product.id}`).set('Authorization', `Bearer ${token}`).expect(204);

    const storedProduct: Product = await productRepository.findOne({
      where: {
        id: product.id,
      },
      withDeleted: true,
    });

    expect(storedProduct.deletedAt).toBeDefined();
    expect(messageBroker.publish).toHaveBeenCalledTimes(1);
    expect(messageBroker.publish).toHaveBeenCalledWith(Subjects.ProductDeleted, { id: product.id, version: product.version + 1 });
  });

  it('tests throwing error on deleting reserved product', async () => {
    const product: Product = await Factory.create(productRepository, productDefinition, { userId: user.id, reservedQuantity: 1 });

    const response = await request(app.instance.getHttpServer()).delete(`${endpoint}/${product.id}`).set('Authorization', `Bearer ${token}`).expect(400);

    const storedProduct: Product = await productRepository.findOneBy({
      id: product.id,
    });

    expect(response.body.errors[0].detail).toBe('You cannot remove reserved product');
    expect(storedProduct).toBeDefined();
    expect(messageBroker.publish).toHaveBeenCalledTimes(0);
  });
});
