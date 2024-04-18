import { Module } from '@nestjs/common';
import { OrderAdminController } from 'modules/admin/order/order.admin.controller';
import { OrderAdminService } from 'modules/admin/order/order.admin.service';
import { JwtService } from 'shared/jwt/jwt.service';
import { OrderHelper } from 'common/helpers/order.helper';

@Module({
  controllers: [OrderAdminController],
  providers: [OrderAdminService, OrderHelper, JwtService],
})
export class OrderAdminModule {}
