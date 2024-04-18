import { SearchWithPaginationDto } from 'common/dto/search-with-pagination.dto';
import { OrderDeliveryStatusEnum } from 'enums/order.enums';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyTypeEnum } from 'enums/property-enums';

export class OrdersGridDto extends SearchWithPaginationDto {
  @ApiProperty({
    description: 'Order delivery status',
    enum: PropertyTypeEnum,
  })
  @IsEnum(OrderDeliveryStatusEnum)
  @IsOptional()
  status?: OrderDeliveryStatusEnum;
}
