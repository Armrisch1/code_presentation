import { Module } from '@nestjs/common';
import { CategoryController } from 'modules/category/category.controller';
import { CategoryService } from 'modules/category/category.service';
import { CategoryHelper } from 'common/helpers/category.helper';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryHelper],
})
export class CategoryModule {}
