import { Module } from '@nestjs/common';
import { OrderController } from 'modules/order/order.controller';
import { OrderService } from 'modules/order/order.service';
import { BasketHelper } from 'common/helpers/basket.helper';
import { OrderHelper } from 'common/helpers/order.helper';
import { StripeService } from 'shared/stripe/stripe.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, BasketHelper, OrderHelper, StripeService],
})
export class OrderModule {}
