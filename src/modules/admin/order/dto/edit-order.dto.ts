import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Order } from 'models/order';
import { ApiProperty } from '@nestjs/swagger';

export class EditOrderDto {
  @ApiProperty({
    description: 'Some of order editable keys',
    type: String,
    required: true,
  })
  @IsString()
  @IsIn(Order.editableAttributes())
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Edit value',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
