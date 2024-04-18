import { Module } from '@nestjs/common';
import { PaymentController } from 'modules/payment/payment.controller';
import { PaymentService } from 'modules/payment/payment.service';
import { StripeService } from 'shared/stripe/stripe.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StripeService]
})
export class PaymentModule {}