import { Body, Controller, Get, Post } from '@nestjs/common';
import { BasketService } from 'modules/basket/basket.service';
import { BasketDto } from 'modules/basket/dto/basket.dto';

@Controller('api/basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('to-checkout')
  goToCheckout(@Body() basketDto: BasketDto) {
    return this.basketService.goToCheckout(basketDto);
  }
}
