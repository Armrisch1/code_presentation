import { Injectable } from '@nestjs/common';
import { OrderItem } from 'models/order-item';
import { Order } from 'models/order';
import { OrderItemInterface } from 'modules/admin/order/interfaces/order-item.interface';
import { Product } from 'models/product';

@Injectable()
export class OrderHelper {
  async calculateOrderTotalPrice(orderId: number) {
    const order = await Order.findByPk(orderId, {
      attributes: ['id'],
      include: {
        model: OrderItem,
        required: true,
        attributes: ['amount'],
        include: [
          {
            model: Product,
            required: true,
            attributes: ['price'],
          },
        ],
      },
    });

    return order.orderItems.reduce((accumulator: number, orderItem: OrderItem) => {
      accumulator += orderItem.product.price * orderItem.amount;

      return accumulator;
    }, 0);
  }

  formOrderItems(orderItems: OrderItem[]): OrderItemInterface[] {
    return orderItems.map((orderItem: OrderItem) => {
      return {
        name: orderItem.product.titleEn,
        price: orderItem.product.price,
        amount: orderItem.amount,
        image: orderItem.product?.images?.length ? orderItem.product.images[0].src : null,
      };
    });
  }
}
