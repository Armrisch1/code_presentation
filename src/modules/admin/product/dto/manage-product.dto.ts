import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductPropertyObject {
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;

  @IsNotEmpty()
  @IsString()
  valEn: string;

  @IsOptional()
  @IsString()
  valAm?: string;
}

export class ManageProductDto {
  @ApiProperty({
    description: 'Category id',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Product price',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Product quantity in warehouse',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty({
    description: 'Age',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'Product title eng',
    type: String,
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({
    description: 'Product title am',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleAm?: string;

  @ApiProperty({
    description: 'Product full description eng',
    type: String,
    required: true,
  })
  @IsString()
  @IsOptional()
  descriptionEn: string;

  @ApiProperty({
    description: 'Product full description am',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionAm?: string;

  @ApiProperty({
    description: 'Product short description eng',
    type: String,
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  shortDescriptionEn: string;

  @ApiProperty({
    description: 'Product short description am',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shortDescriptionAm?: string;

  @ApiProperty({
    description: 'Meta title for seo',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  metaTitle?: string;

  @ApiProperty({
    description: 'Meta description for seo',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaDescription?: string;

  @ApiProperty({
    description: 'Is product hidden',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean = false;

  @ApiProperty({
    description: 'Is top product',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isTop?: boolean = false;

  @ApiProperty({
    description: 'Is bestseller product',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isBestseller?: boolean = false;

  @ApiProperty({
    description: 'Product images',
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Sub products',
    type: Number,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  subProductIds?: number[];

  @ApiProperty({
    description: 'Product properties',
    type: () => ProductPropertyObject,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductPropertyObject)
  productProperties?: ProductPropertyObject[];
}
