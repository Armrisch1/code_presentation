import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from 'modules/order/order.service';
import { BasketAndOrderInfoDto } from 'modules/order/dto/basket-and-order-info.dto';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('new')
  newOrder(@Body() basketAndOrderInfo: BasketAndOrderInfoDto) {
    return this.orderService.newOrder(basketAndOrderInfo);
  }
}
