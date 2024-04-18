import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'common/dto/pagination.dto';
import { IsNumberArray } from 'validators/is-number-array';
import { Type } from 'class-transformer';

export class PriceRange {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'price from',
  })
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object) => !object?.to)
  from?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'price to',
  })
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object) => !object?.from)
  to?: number;
}

export class PropertyFilter {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Property filter id',
  })
  @IsNumber()
  @IsNotEmpty()
  propertyId: number;

  @ApiProperty({
    required: true,
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'number',
      },
    ],
    isArray: true,
    description: 'Need to pass number or string array',
  })
  @ArrayNotEmpty()
  @IsArray()
  values: number[] | string[];
}

export class FilterPageDto extends PaginationDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Category id',
  })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    required: false,
    type: Number,
    isArray: true,
    description: 'Selected subcategories ids',
  })
  @IsNumberArray()
  @IsArray()
  @IsOptional()
  subCategories?: number[];

  @ApiProperty({
    required: false,
    type: Number,
    isArray: true,
    description: 'Selected ages',
  })
  @IsNumberArray()
  @IsOptional()
  age?: number[];

  @ApiProperty({
    required: false,
    type: PriceRange,
    description: 'Price range object',
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceRange)
  priceRange?: PriceRange;

  @ApiProperty({
    required: false,
    type: PropertyFilter,
    description: 'Property filter array',
  })
  @ValidateNested()
  @Type(() => PropertyFilter)
  propertyFilters: PropertyFilter[];
}
