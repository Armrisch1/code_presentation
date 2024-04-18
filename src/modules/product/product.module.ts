import { Module } from '@nestjs/common';
import { ProductController } from 'modules/product/product.controller';
import { ProductService } from 'modules/product/product.service';
import { CategoryHelper } from 'common/helpers/category.helper';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CategoryHelper],
})
export class ProductModule {}
