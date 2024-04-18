import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from 'modules/category/category.service';
import { ApiParam } from '@nestjs/swagger';
import { TOP_CATEGORIES_DEFAULT_LIMIT } from 'constants/config';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('top/:limit?')
  @ApiParam({ name: 'limit', type: String, required: false })
  getTopCategories(@Param('limit') limit: string | number = TOP_CATEGORIES_DEFAULT_LIMIT) {
    return this.categoryService.getTopCategories(+limit);
  }

  @Get('tree')
  getCategoryTree() {
    return this.categoryService.getCategoryTree();
  }
}
