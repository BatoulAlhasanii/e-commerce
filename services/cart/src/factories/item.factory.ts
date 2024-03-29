import { faker } from '@faker-js/faker';
import { IItem } from '@/modules/cart/interfaces/item.interface';

export const itemDefinition = (): IItem => {
  return {
    productId: faker.string.uuid(),
    productName: faker.commerce.productName(),
    productPrice: faker.number.float({
      min: 100.0,
      max: 500.0,
      fractionDigits: 2,
    }),
    quantity: faker.number.int({ min: 1, max: 3 }),
  };
};
