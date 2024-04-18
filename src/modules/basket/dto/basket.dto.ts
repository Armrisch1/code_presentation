import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { IsNumeric } from 'validators/is-numeric';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BasketItemDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Selected products id',
  })
  @IsNumeric()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Selected quantity',
  })
  @IsNumeric()
  @IsNotEmpty()
  qty: number;
}

export class BasketDto {
  @ApiProperty({
    required: true,
    type: BasketItemDto,
    isArray: true,
    description: 'Basket items',
  })
  @ValidateNested({ each: true })
  @Type(() => BasketItemDto)
  @ArrayNotEmpty()
  basketItems: BasketItemDto[];
}
