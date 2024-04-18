import { Stripe } from 'stripe';

export type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;
export type PaymentMethodType = Stripe.Checkout.SessionCreateParams.PaymentMethodType;
export type Mode = Stripe.Checkout.SessionCreateParams.Mode;
