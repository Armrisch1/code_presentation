import { Module } from '@nestjs/common';
import { ProductAdminController } from 'modules/admin/product/product.admin.controller';
import { ProductAdminService } from 'modules/admin/product/product.admin.service';
import { JwtService } from 'shared/jwt/jwt.service';

@Module({
  controllers: [ProductAdminController],
  providers: [ProductAdminService, JwtService],
})
export class ProductAdminModule {}
