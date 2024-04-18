import { Body, Controller, Delete, Param, Post, Put, Get, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { PropertyAdminService } from 'modules/admin/property/property.admin.service';
import { ManagePropertyDto } from 'modules/admin/property/dto/manage-property.dto';
import { AdminGuard } from 'guards/admin.guard';
import { SearchWithPaginationDto } from 'common/dto/search-with-pagination.dto';

@Controller('/api/admin/property')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class PropertyAdminController {
  constructor(private readonly propertyAdminService: PropertyAdminService) {}

  @Post()
  create(@Body() managePropertyDto: ManagePropertyDto) {
    return this.propertyAdminService.createProperty(managePropertyDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() managePropertyDto: ManagePropertyDto) {
    return this.propertyAdminService.updateProperty(id, managePropertyDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.propertyAdminService.deleteProperty(id);
  }

  @ApiParam({ name: 'categoryId', required: false, type: Number })
  @Get('by-category-id/:categoryId')
  getByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.propertyAdminService.getByCategoryId(categoryId);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Get('edit-page-data/:id')
  getPropertyEditPageData(@Param('id', ParseIntPipe) id: number) {
    return this.propertyAdminService.getPropertyEditPageData(id);
  }

  @Get()
  getAll(@Query() searchWithPaginationDto: SearchWithPaginationDto) {
    return this.propertyAdminService.getAll(searchWithPaginationDto);
  }
}
