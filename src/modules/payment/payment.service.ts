import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Order } from 'models/order';
import { OrderDeliveryStatusEnum, OrderPaymentStatusEnum } from 'enums/order.enums';
import { STRIPE_FRONTEND_CANCEL_URL, STRIPE_FRONTEND_SUCCESS_URL } from 'constants/config';
import { Product } from 'models/product';
import { OrderItem } from 'models/order-item';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateResponse } from 'utils/helpers';

@Injectable()
export class PaymentService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async success(sessionId: string, hash: string) {
    if (!sessionId) {
      throw new ConflictException('Session id is required');
    }

    if (!(await this.cache.get(hash))) {
      throw new ConflictException('Session expired');
    }

    await this.cache.del(hash);

    const order = await Order.findOne({
      where: {
        stripeSessionId: sessionId,
        paymentStatus: OrderPaymentStatusEnum.pending,
      },
    });

    if (!order) {
      throw new ConflictException('No order with provided session id');
    }

    order.paymentStatus = OrderPaymentStatusEnum.success;
    order.deliveryStatus = OrderDeliveryStatusEnum.new;
    await order.save();

    const orderItems = await order.$get('orderItems');
    const products = await Promise.all(orderItems.map((orderItem: OrderItem) => orderItem.$get('product')));
    await Promise.all(
      orderItems.map((orderItem: OrderItem, index: number) =>
        Product.update(
          {
            qty: products[index].qty - orderItem.amount > 0 ? products[index].qty - orderItem.amount : 0,
          },
          {
            where: {
              id: orderItem.productId,
            },
          },
        ),
      ),
    );

    return STRIPE_FRONTEND_SUCCESS_URL + sessionId;
  }

  async cancel(sessionId: string, hash: string) {
    if (!sessionId) {
      throw new ConflictException('Session id is required');
    }

    if (!(await this.cache.get(hash))) {
      throw new ConflictException('Session expired');
    }

    await this.cache.del(hash);

    const order = await Order.findOne({
      where: {
        stripeSessionId: sessionId,
        paymentStatus: OrderPaymentStatusEnum.pending,
      },
    });

    if (!order) {
      throw new ConflictException('No order with provided session id');
    }

    order.paymentStatus = OrderPaymentStatusEnum.failed;
    await order.save();

    return STRIPE_FRONTEND_CANCEL_URL + sessionId;
  }

  async checkHash(hash: string) {
    const order = await Order.findOne({
      where: {
        stripeSessionId: hash,
      },
    });
    const response = {
      paymentStatus: +order.paymentStatus,
    };

    if (!order || order?.isPaymentModalShown) {
      response.paymentStatus = 0;
    }

    if (order && !order?.isPaymentModalShown) {
      order.isPaymentModalShown = true;
      await order.save();
    }

    return generateResponse(response);
  }
}
