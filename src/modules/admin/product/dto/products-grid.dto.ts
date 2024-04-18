import { SearchWithPaginationDto } from 'common/dto/search-with-pagination.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumeric } from 'validators/is-numeric';

export class ProductsGridDto extends SearchWithPaginationDto {
  @ApiProperty({
    name: 'parentCategoryId',
    type: Number,
    required: false,
    description: 'Parent category id',
  })
  @IsOptional()
  @IsNumeric()
  parentCategoryId?: number;
}
