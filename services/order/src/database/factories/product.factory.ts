import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Product } from '@/modules/product/entities/product.entity';
import { faker } from '@faker-js/faker';

export const productDefinition = (): DeepPartial<Product> => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.number.float({ min: 100.0, max: 500.0, fractionDigits: 2 }),
  };
};
