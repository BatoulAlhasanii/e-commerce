export interface IStripeConfig {
  stripeKey: string;
}

export const stripeConfig: IStripeConfig = {
  stripeKey: process.env.STRIPE_KEY,
};
