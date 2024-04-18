import { DeepPartial } from 'typeorm/common/DeepPartial';
import { faker } from '@faker-js/faker';
import { Payment } from '@/modules/payment/entities/payment.entity';

export const paymentDefinition = (): DeepPartial<Payment> => {
  return {
    orderId: faker.string.uuid(),
    stripeId: faker.string.uuid(),
  };
};
