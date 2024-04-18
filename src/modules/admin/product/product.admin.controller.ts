import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProductAdminService } from 'modules/admin/product/product.admin.service';
import { ManageProductDto } from 'modules/admin/product/dto/manage-product.dto';
import { ProductsGridDto } from 'modules/admin/product/dto/products-grid.dto';
import { AdminGuard } from 'guards/admin.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('api/admin/product')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}
  @Post('all')
  getAll(@Body() productsGridDto: ProductsGridDto) {
    return this.productAdminService.getAll(productsGridDto);
  }

  @Post()
  create(@Body() manageProductDto: ManageProductDto) {
    return this.productAdminService.create(manageProductDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Put(':id')
  update(@Body() manageProductDto: ManageProductDto, @Param('id', ParseIntPipe) id: number) {
    return this.productAdminService.update(id, manageProductDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productAdminService.delete(id);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Get('edit-page-data/:id')
  editPageData(@Param('id', ParseIntPipe) id: number) {
    return this.productAdminService.getEditPageData(id);
  }

  @Get('create-page-data')
  createPageData() {
    return this.productAdminService.getCreatePageData();
  }
}
