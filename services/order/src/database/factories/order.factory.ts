import { DeepPartial } from 'typeorm/common/DeepPartial';
import { faker } from '@faker-js/faker';
import { Order } from '@/modules/order/entities/order.entity';

export const orderDefinition = (): DeepPartial<Order> => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    total: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
  };
};
