import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PAGINATION_DEFAULT_LIMIT } from 'constants/config';
import { IsNumeric } from 'validators/is-numeric';

export class PaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Limit of items',
  })
  @IsOptional()
  @IsNumeric()
  limit?: number = PAGINATION_DEFAULT_LIMIT;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'The page number for pagination.',
  })
  @IsOptional()
  @IsNumeric()
  page?: number = 1;
}
