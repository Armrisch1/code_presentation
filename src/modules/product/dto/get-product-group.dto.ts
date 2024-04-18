import { ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'common/dto/pagination.dto';

export class GetProductGroupDto extends PaginationDto {
  @ApiProperty({
    required: true,
    type: Number,
    isArray: true,
    description: 'Selected products ids',
  })
  @IsArray()
  @ArrayNotEmpty()
  productsIds: number[];
}
