import { DeepPartial } from 'typeorm/common/DeepPartial';
import { faker } from '@faker-js/faker';
import { OrderItem } from '@/modules/order/entities/order-item.entity';

export const orderItemDefinition = (): DeepPartial<OrderItem> => {
  return {
    id: faker.string.uuid(),
    productId: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 3 }),
    price: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
    orderId: faker.string.uuid(),
  };
};
