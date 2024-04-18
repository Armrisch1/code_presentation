import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'guards/admin.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EditOrderDto } from 'modules/admin/order/dto/edit-order.dto';
import { OrderAdminService } from 'modules/admin/order/order.admin.service';
import { OrdersGridDto } from 'modules/admin/order/dto/orders-grid.dto';

@Controller('api/admin/order')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class OrderAdminController {
  constructor(private readonly orderAdminService: OrderAdminService) {}

  @ApiParam({ name: 'id', required: true, type: Number })
  @Patch(':id')
  editOrderKey(@Param('id', ParseIntPipe) id: number, @Body() editOrderDto: EditOrderDto) {
    return this.orderAdminService.editOrderKey(id, editOrderDto);
  }

  @ApiParam({ name: 'id', required: true, type: Number })
  @Get(':id')
  getOrderData(@Param('id', ParseIntPipe) id: number) {
    return this.orderAdminService.getOrderData(id);
  }

  @Post('all')
  getOrders(@Body() ordersGridDto: OrdersGridDto) {
    return this.orderAdminService.getOrders(ordersGridDto);
  }
}
