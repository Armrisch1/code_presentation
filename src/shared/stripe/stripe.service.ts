import { Stripe } from 'stripe';
import { Inject, Injectable } from '@nestjs/common';
import { LineItem, Mode, PaymentMethodType } from 'common/types/stripe.type';
import { BACKEND_DOMAIN, STRIPE_MODE, STRIPE_SECRET_KEY } from 'constants/config';
import { generateRandomHash } from 'utils/helpers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly mode: Mode;
  private readonly paymentMethodTypes: PaymentMethodType[];
  private readonly successUrl: string;
  private readonly cancelUrl: string;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.stripe = new Stripe(STRIPE_SECRET_KEY);
    this.mode = STRIPE_MODE as Mode;
    this.successUrl = `${BACKEND_DOMAIN}/api/payment/success/{CHECKOUT_SESSION_ID}`;
    this.cancelUrl = `${BACKEND_DOMAIN}/api/payment/cancel/{CHECKOUT_SESSION_ID}`;
    this.paymentMethodTypes = ['card'];
  }

  async createCheckoutSession(lineItems: LineItem[]) {
    const { successUrl: success_url, cancelUrl: cancel_url } = await this.generateSecureRedirectUrls();

    return this.stripe.checkout.sessions.create({
      payment_method_types: this.paymentMethodTypes,
      line_items: lineItems,
      mode: this.mode,
      success_url,
      cancel_url,
    });
  }

  async generateSecureRedirectUrls() {
    const successHash = generateRandomHash();
    const cancelHash = generateRandomHash();

    await Promise.all([this.cache.set(successHash, successHash, 0), this.cache.set(cancelHash, cancelHash, 0)]);

    const successUrl = `${this.successUrl}/${successHash}`;
    const cancelUrl = `${this.cancelUrl}/${cancelHash}`;

    return { successUrl, cancelUrl };
  }
}
