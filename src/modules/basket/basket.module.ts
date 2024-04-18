import { Module } from '@nestjs/common';
import { BasketController } from 'modules/basket/basket.controller';
import { BasketService } from 'modules/basket/basket.service';
import { BasketHelper } from 'common/helpers/basket.helper';

@Module({
  controllers: [BasketController],
  providers: [BasketService, BasketHelper],
})
export class BasketModule {}
