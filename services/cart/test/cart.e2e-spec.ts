import * as request from 'supertest';
import { AppFactory } from './factories/app';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthUserPayload } from '@/modules/auth/types';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import {
  IMessageBroker,
  MESSAGE_BROKER,
} from '@/modules/message-broker/interfaces/message-broker.interface';
import { IItem } from '@/modules/cart/interfaces/item.interface';
import { itemDefinition } from '@/factories/item.factory';
import Redis from 'ioredis';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import { ICart } from '@/modules/cart/interfaces/cart.interface';

describe('CartController (e2e)', () => {
  let app: AppFactory;
  const endpoint: string = '/carts';
  const user: AuthUserPayload = {
    id: faker.string.uuid(),
    role: UserRole.SELLER,
  };
  let token: string;
  let messageBroker: IMessageBroker;
  let redis: Redis;

  beforeAll(async () => {
    app = await AppFactory.new();

    token = app.instance.get(JwtService).sign(user);

    messageBroker = app.instance.get(MESSAGE_BROKER);

    redis = app.instance.get<Redis>(getRedisConnectionToken());
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PUT /carts/add-item', () => {
    it('tests adding item to an empty cart successfully', async () => {
      const item: IItem = itemDefinition();

      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'set').mockResolvedValue('Ok');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/add-item`)
        .set('Authorization', `Bearer ${token}`)
        .send(item)
        .expect(200);

      expect(response.body.data.total).toEqual(
        item.productPrice * item.quantity,
      );
      expect(response.body.data.items[0]).toMatchObject(item);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(1);
      expect(redis.set).toBeCalledWith(
        user.id,
        JSON.stringify({
          items: [item],
          total: item.productPrice * item.quantity,
        }),
      );
    });

    it('tests adding item to an existing cart successfully', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set').mockResolvedValue('Ok');

      const newItem: IItem = itemDefinition();

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/add-item`)
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .expect(200);

      cart.total += newItem.productPrice * newItem.quantity;
      cart.items.push(newItem);

      expect(response.body.data.total).toEqual(cart.total);
      expect(response.body.data.items[0]).toMatchObject(addedItem);
      expect(response.body.data.items[1]).toMatchObject(newItem);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(1);
      expect(redis.set).toBeCalledWith(user.id, JSON.stringify(cart));
    });

    it('tests throwing error when the added item exists in cart', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set');

      await request(app.instance.getHttpServer())
        .put(`${endpoint}/add-item`)
        .set('Authorization', `Bearer ${token}`)
        .send(addedItem)
        .expect(400);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(0);
    });
  });

  describe('GET /carts', () => {
    it('tests get cart successfully', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);

      const response = await request(app.instance.getHttpServer())
        .get(`${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toMatchObject(cart);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);
    });
  });

  describe('PUT /carts/update-item/:productId', () => {
    it('tests updating item from cart successfully', async () => {
      const firstAddedItem: IItem = itemDefinition();
      const secondAddedItem: IItem = { ...itemDefinition(), quantity: 1 };
      const thirdAddedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [firstAddedItem, secondAddedItem, thirdAddedItem],
        total:
          firstAddedItem.productPrice * firstAddedItem.quantity +
          secondAddedItem.productPrice * secondAddedItem.quantity +
          thirdAddedItem.productPrice * thirdAddedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set').mockResolvedValue('Ok');

      const payload = { quantity: 2 };

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/update-item/${secondAddedItem.productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(200);

      const newTotal: number =
        firstAddedItem.productPrice * firstAddedItem.quantity +
        secondAddedItem.productPrice * payload.quantity +
        thirdAddedItem.productPrice * thirdAddedItem.quantity;

      expect(response.body.data.total).toEqual(newTotal);
      expect(response.body.data.items[1]).toMatchObject({
        ...secondAddedItem,
        ...payload,
      });
      expect(response.body.data.items.length).toEqual(3);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(1);
      expect(redis.set).toBeCalledWith(
        user.id,
        JSON.stringify({
          items: [
            firstAddedItem,
            { ...secondAddedItem, ...payload },
            thirdAddedItem,
          ],
          total: newTotal,
        }),
      );
    });

    it('tests throwing error on updating item from non existing cart', async () => {
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'set');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/update-item/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body.errors[0].detail).toBe("Item doesn't exist");
      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(0);
    });

    it('tests throwing error on updating non existing item from cart', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/update-item/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body.errors[0].detail).toBe("Item doesn't exist");
      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(0);
    });
  });

  describe('PUT /carts/remove-item/:productId', () => {
    it('tests removing item from cart successfully', async () => {
      const firstAddedItem: IItem = itemDefinition();
      const secondAddedItem: IItem = itemDefinition();
      const thirdAddedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [firstAddedItem, secondAddedItem, thirdAddedItem],
        total:
          firstAddedItem.productPrice * firstAddedItem.quantity +
          secondAddedItem.productPrice * secondAddedItem.quantity +
          thirdAddedItem.productPrice * thirdAddedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set').mockResolvedValue('Ok');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/remove-item/${secondAddedItem.productId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const newTotal: number =
        firstAddedItem.productPrice * firstAddedItem.quantity +
        thirdAddedItem.productPrice * thirdAddedItem.quantity;

      expect(response.body.data.total).toEqual(newTotal);
      expect(response.body.data.items.length).toEqual(2);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(1);
      expect(redis.set).toBeCalledWith(
        user.id,
        JSON.stringify({
          items: [firstAddedItem, thirdAddedItem],
          total: newTotal,
        }),
      );
    });

    it('tests throwing error when removing item from non existing cart', async () => {
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'set');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/remove-item/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.errors[0].detail).toBe("Item doesn't exist");
      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(0);
    });

    it('tests throwing error when removing non existing item from cart', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'set');

      const response = await request(app.instance.getHttpServer())
        .put(`${endpoint}/remove-item/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.errors[0].detail).toBe("Item doesn't exist");
      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.set).toBeCalledTimes(0);
    });
  });

  describe('DELETE /carts', () => {
    it('tests delete cart successfully', async () => {
      const addedItem: IItem = itemDefinition();

      const cart: ICart = {
        items: [addedItem],
        total: addedItem.productPrice * addedItem.quantity,
      };

      const cartString: string = JSON.stringify(cart);

      jest.spyOn(redis, 'get').mockResolvedValue(cartString);
      jest.spyOn(redis, 'del').mockResolvedValue(1);

      await request(app.instance.getHttpServer())
        .delete(`${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.del).toBeCalledTimes(1);
      expect(redis.del).toBeCalledWith(user.id);
    });

    it('tests throwing error on deletion of non existing cart', async () => {
      jest.spyOn(redis, 'get').mockResolvedValue(null);
      jest.spyOn(redis, 'del');

      const response = await request(app.instance.getHttpServer())
        .delete(`${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.errors[0].detail).toBe("Cart doesn't exist");

      expect(redis.get).toBeCalledTimes(1);
      expect(redis.get).toBeCalledWith(user.id);

      expect(redis.del).toBeCalledTimes(0);
    });
  });
});
