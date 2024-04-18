import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { PaymentIntentStatus } from '@/modules/message-broker/enums/payment-intent-status.enum';

@Injectable()
export class MockStripeService {
  createPaymentIntent = jest.fn().mockImplementation(async (amount: number) => {
    return Promise.resolve({ id: faker.string.uuid() });
  });

  retrievePaymentIntent = jest.fn().mockImplementation(async (paymentIntentId: string) => {
    return { status: faker.helpers.enumValue(PaymentIntentStatus) };
  });
}
