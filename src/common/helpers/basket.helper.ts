import { ConflictException, Injectable } from '@nestjs/common';
import { BasketDto, BasketItemDto } from 'modules/basket/dto/basket.dto';
import { Product } from 'models/product';
import { pluck } from 'utils/helpers';
import { UnavailableProductInterface } from 'modules/basket/interfaces/go-to-checkout-response.interface';
import { Order } from 'models/order';
import { OrderPaymentStatusEnum } from 'enums/order.enums';
import { OrderItem } from 'models/order-item';

@Injectable()
export class BasketHelper {
  async checkAndGetUnavailableProducts(basketDto: BasketDto): Promise<UnavailableProductInterface[]> {
    const { basketItems } = basketDto;

    const products = await Product.findAll({
      where: {
        id: pluck(basketItems, 'productId'),
        isHidden: false,
      },
    });
    const orders = await Order.findAll({
      where: {
        paymentStatus: OrderPaymentStatusEnum.pending,
      },
      include: {
        model: OrderItem,
        required: true,
      },
    });
    const unavailableProducts: UnavailableProductInterface[] = [];

    if (products.length !== basketItems.length) {
      throw new ConflictException('Some of selected products none exist');
    }

    const productsRemainingData: { [productId: number]: number } = {};
    products.forEach((product: Product) => (productsRemainingData[product.id] = product.qty));

    if (orders.length) {
      orders.forEach((order: Order) => {
        order.orderItems.forEach((orderItem: OrderItem) => {
          if (orderItem.productId in productsRemainingData) {
            const remainingQtyOfProduct = productsRemainingData[orderItem.productId] - orderItem.amount;

            productsRemainingData[orderItem.productId] = remainingQtyOfProduct >= 0 ? remainingQtyOfProduct : 0;
          }
        });
      });
    }

    let index = 0;

    for (const property in productsRemainingData) {
      if (productsRemainingData[property] < basketItems[index].qty) {
        const availableQty = productsRemainingData[property];

        unavailableProducts.push({
          productId: +property,
          requestedQty: basketItems.find((basketItem: BasketItemDto) => basketItem.productId === +property).qty,
          availableQty: availableQty,
        });
      }

      index++;
    }

    return unavailableProducts;
  }
}
