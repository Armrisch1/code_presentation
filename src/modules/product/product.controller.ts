import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { ProductService } from 'modules/product/product.service';
import { BESTSELLERS_DEFAULT_LIMIT } from 'constants/config';
import { PaginationDto } from 'common/dto/pagination.dto';
import { GetProductGroupDto } from 'modules/product/dto/get-product-group.dto';
import { FilterPageDto } from 'modules/product/dto/filter-page.dto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('bestsellers/:limit?')
  @ApiParam({ name: 'limit', type: String, required: false })
  getBestsellers(
    @Param('limit')
    limit: string | number = BESTSELLERS_DEFAULT_LIMIT,
  ) {
    return this.productService.getBestsellers(+limit, true);
  }

  @Get('search/:search?')
  @ApiParam({
    name: 'search',
    type: String,
    required: false,
    description: 'Search term for product titles.',
  })
  search(@Param('search') search: string, @Query() paginationDto: PaginationDto) {
    return this.productService.search(search, paginationDto);
  }

  @Post('by-ids')
  getProductsByIds(@Body() getProductGroupDto: GetProductGroupDto) {
    return this.productService.getProductByIdGroup(getProductGroupDto);
  }

  @Get('view/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  getProductViewPageData(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductViewPageData(id);
  }

  @Get('list-data/:categoryId')
  @ApiParam({ name: 'categoryId', required: true, type: Number })
  getListPageData(@Param('categoryId', ParseIntPipe) categoryId: number, @Query() paginationDto: PaginationDto) {
    return this.productService.getListPageData(categoryId, paginationDto);
  }

  @Post('filter-list')
  filterListPage(@Body() filterPageDto: FilterPageDto) {
    return this.productService.filterListPage(filterPageDto);
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.productService.getProducts(paginationDto);
  }
}
