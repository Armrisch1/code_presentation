import { BadRequestException, Injectable } from '@nestjs/common';
import { BasketDto } from 'modules/basket/dto/basket.dto';
import { generateResponse } from 'utils/helpers';
import { GoToCheckoutResponseInterface } from 'modules/basket/interfaces/go-to-checkout-response.interface';
import { AppResponse } from 'common/types/response.type';
import { BasketHelper } from 'common/helpers/basket.helper';

@Injectable()
export class BasketService {
  constructor(private readonly basketHelper: BasketHelper) {}

  async goToCheckout(basketDto: BasketDto): AppResponse<GoToCheckoutResponseInterface> {
    const { basketItems } = basketDto;

    if (!basketItems.length) {
      throw new BadRequestException('At least one product need to be selected');
    }

    const unavailableProducts = await this.basketHelper.checkAndGetUnavailableProducts(basketDto);

    return generateResponse({
      unavailableProducts,
      needToRedirectToCheckout: !unavailableProducts.length,
    });
  }
}
