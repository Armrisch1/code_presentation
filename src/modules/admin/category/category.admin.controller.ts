import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { CategoryAdminService } from 'modules/admin/category/category.admin.service';
import { AdminGuard } from 'guards/admin.guard';
import { ManageCategoryDto } from 'modules/admin/category/dto/manage-category.dto';

@Controller(`api/admin/category`)
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class CategoryAdminController {
  constructor(private readonly categoryAdminService: CategoryAdminService) {}

  @Post('/')
  create(@Body() createCategoryDto: ManageCategoryDto) {
    return this.categoryAdminService.create(createCategoryDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() manageCategoryDto: ManageCategoryDto) {
    return this.categoryAdminService.update(id, manageCategoryDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoryAdminService.delete(id);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Get('edit-page-data/:id')
  editPageData(@Param('id', ParseIntPipe) id: number) {
    return this.categoryAdminService.getEditPageData(id);
  }

  @Get('create-page-data')
  createPageData() {
    return this.categoryAdminService.getCreatePageData();
  }

  @Get()
  getAll() {
    return this.categoryAdminService.getCategories();
  }
}
