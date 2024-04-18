import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManageCategoryDto {
  @ApiProperty({
    description: 'Parent category id',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    description: 'Title en',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({
    description: 'Title am',
    type: String,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  titleAm?: string;

  @ApiProperty({
    description: 'Meta title',
    type: String,
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({
    description: 'Meta Description',
    type: String,
    required: false,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  metaDescription?: string;

  @ApiProperty({
    description: 'Is category hidden',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean = false;

  @ApiProperty({
    description: 'Is top category',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isTop?: boolean = false;

  @ApiProperty({
    description: 'Img for parent category',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  img?: string;

  @ApiProperty({
    description: 'Attached properties id group',
    type: Number,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  propertiesIds?: Array<number> = [];
}
