import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from 'modules/payment/payment.service';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('success/:checkoutSessionId/:hash')
  async success(
    @Param('checkoutSessionId') checkoutSessionId: string,
    @Param('hash') hash: string,
    @Res() res: Response,
  ) {
    const redirectUrl = await this.paymentService.success(checkoutSessionId, hash);
    res.redirect(redirectUrl);
  }

  @Get('cancel/:checkoutSessionId/:hash')
  async cancel(
    @Param('checkoutSessionId') checkoutSessionId: string,
    @Param('hash') hash: string,
    @Res() res: Response,
  ) {
    const redirectUrl = await this.paymentService.cancel(checkoutSessionId, hash);
    res.redirect(redirectUrl);
  }

  @Get('check-hash/:hash')
  async checkHash(@Param('hash') hash: string) {
    return this.paymentService.checkHash(hash);
  }
}
