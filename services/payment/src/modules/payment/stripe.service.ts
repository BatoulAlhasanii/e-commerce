import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.stripeKey'), {
      apiVersion: '2024-04-10',
    });
  }

  async createPaymentIntent(amount: number) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
    });
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
