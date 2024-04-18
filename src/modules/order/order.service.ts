import { ConflictException, Injectable } from '@nestjs/common';
import { generateResponse, pluck } from 'utils/helpers';
import { BasketAndOrderInfoDto } from 'modules/order/dto/basket-and-order-info.dto';
import { BasketHelper } from 'common/helpers/basket.helper';
import { Order } from 'models/order';
import { OrderDeliveryStatusEnum, OrderPaymentStatusEnum } from 'enums/order.enums';
import { OrderItem } from 'models/order-item';
import { BasketItemDto } from 'modules/basket/dto/basket.dto';
import { Product } from 'models/product';
import { LineItem } from 'common/types/stripe.type';
import { STRIPE_CURRENCY } from 'constants/config';
import { StripeService } from 'shared/stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(private readonly basketHelper: BasketHelper, private readonly stripeService: StripeService) {}
  async newOrder(basketAndOrderInfo: BasketAndOrderInfoDto) {
    const { basketItems, ...orderData } = basketAndOrderInfo;

    const unavailableProducts = await this.basketHelper.checkAndGetUnavailableProducts({ basketItems });
    const responseData = {
      redirectToPaymentPage: true,
      redirectUrl: '',
      message: 'success',
      unavailableProducts: [],
    };

    if (unavailableProducts.length) {
      responseData.redirectToPaymentPage = false;
      responseData.message = 'Some products in list are unavailable';
      responseData.unavailableProducts = unavailableProducts;

      return generateResponse(responseData);
    }

    try {
      const newOrder = await Order.create({
        ...orderData,
        fullAddress: `${orderData.postalCode}, ${orderData.address} ${orderData.city} ${orderData.country}`,
        deliveryStatus: OrderDeliveryStatusEnum.new,
        paymentStatus: OrderPaymentStatusEnum.pending,
      });

      await OrderItem.bulkCreate(
        basketItems.map((basketItem: BasketItemDto) => ({
          orderId: newOrder.id,
          productId: basketItem.productId,
          amount: basketItem.qty,
        })),
      );
      const lineItems = await this.generateLineItemsByBasket(basketItems);
      const stripeResponseData = await this.stripeService.createCheckoutSession(lineItems);

      newOrder.stripeSessionId = stripeResponseData.id;
      await newOrder.save();

      responseData.redirectUrl = stripeResponseData.url;
    } catch (err: any) {
      console.log(err, err.message);

      responseData.redirectUrl = '';
      responseData.redirectToPaymentPage = false;
      responseData.message = 'Something went wrong';
    }

    return generateResponse(responseData);
  }

  async generateLineItemsByBasket(basketItems: BasketItemDto[]): Promise<LineItem[]> {
    const orderedBasketItems = basketItems.sort((a: BasketItemDto, b: BasketItemDto) => a.productId - b.productId);
    const productIds = pluck<BasketItemDto, number>(orderedBasketItems, 'productId');
    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'titleEn', 'titleAm', 'price'],
      order: [['id', 'ASC']],
    });

    if (products.length !== orderedBasketItems.length) {
      throw new ConflictException('Some products in basket are not available');
    }

    return orderedBasketItems.map<LineItem>((basketItem: BasketItemDto, index: number) => {
      return {
        price_data: {
          currency: STRIPE_CURRENCY,
          product_data: {
            name: products[index].titleEn,
          },
          unit_amount: products[index].price * 100,
        },
        quantity: basketItem.qty,
      };
    });
  }
}
