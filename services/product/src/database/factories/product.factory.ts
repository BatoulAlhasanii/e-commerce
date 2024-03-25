import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Product } from '@/modules/product/entities/product.entity';
import { faker } from '@faker-js/faker';

export const productDefinition = (): DeepPartial<Product> => {
  return {
    name: faker.commerce.productName(),
    stock: faker.number.int({ min: 0, max: 100 }),
    price: faker.number.float({ min: 100.0, max: 500.0 }),
    userId: faker.string.uuid(),
  };
};
